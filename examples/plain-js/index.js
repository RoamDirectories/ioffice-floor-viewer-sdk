// Utility objects to interact with the DOM
var ping = {};
var select = {};
var setMarkers = {};

/**
 * Return an object containing the query parameters.
 */
function getQueryParams() {
  var url = window.location.href;
  var query = {};
  var params = url.substr(url.lastIndexOf('?') + 1).split('&');
  params.forEach(function (item) {
    var col = item.split('=');
    query[decodeURIComponent(col[0])] = decodeURIComponent(col[1]);
  });
  return query;
}

/**
 * Wrapper function to obtain the user credentials based on the username/password or oauth token.
 * Failure to provide those query parameters will throw an error.
 *
 * @param query An object containing the query parameters.
 */
function getUserCredentials(query) {
  var credentials = {};
  if (query.token) {
    credentials = {
      'x-access-token': query.token,
    };
  } else {
    throw Error('missing user credentials, provide either [user, pass] or [token] queries.');
  }
  return credentials;
}

/**
 * Entry point for the program to execute once the DOM is loaded.
 */
function main() {
  var query = getQueryParams();

  var sdk = new FloorViewerSDK({
    siteUrl: query.siteUrl,
    accessHeaders: getUserCredentials(query),
    floorId: query.floorId,
    container: 'fv-container',
  });

  sdk.onReady().then(function () {
    sdk.getVersion().then(function (version) {
      console.log('Using VERSION:', version);
    });
    sdk.addMarkers(markers).then(function (ids) {
      _.each(ids, function(id, index) {
        markers[index].id = id;
      });
    });
  });

  var markers = [
    {
      icon: 'home',
      markerColor: 'red',
      latlng: [-3.23046875, 4.28125]
    },
    {
      icon: 'pizza',
      markerColor: 'blue',
      latlng: [-4.8203125, 1.265625]
    }
  ];

  sdk.onRoomClick(function (event) {
    console.log('latlng: ', event.latlng);
    var room = event.room;
    var div = document.getElementById('map-info');
    if (!room) {
      div.innerHTML = 'No room was clicked ...';
      return;
    }
    var roomInfo = {
      id: room.id,
      name: room.name,
      users: room.users
    };
    var content = '<strong>Room Info</strong>';
    content += '<pre>' + JSON.stringify(roomInfo, null, 2) + '</pre>';
    div.innerHTML = content;
  });

  sdk.onFvError(function (event) {
    var div = document.getElementById('map-errors');
    var content = '<pre>' + JSON.stringify(event, null, 2) + '</pre>';
    div.innerHTML = content;
  });

  ping.roomById = function () {
    var roomId = document.getElementById('input-room-id').value;
    if (roomId) {
      sdk.pingByRoomId(roomId);
    }
  };

  ping.roomByName = function () {
    var roomName = document.getElementById('input-room-name').value;
    if (roomName) {
      sdk.pingByRoomName(roomName, {
        duration: 10,
        color: [255, 0, 0],
      });
    }
  };

  select.roomById = function () {
    var roomId = document.getElementById('select-room-id').value;
    if (roomId) {
      sdk.selectRoomById(roomId);
    } else {
      sdk.unselectRooms();
    }
  };

  select.roomByName = function () {
    var roomName = document.getElementById('select-room-name').value;
    if (roomName) {
      sdk.selectRoomByName(roomName);
    } else {
      sdk.unselectRooms();
    }
  };

  setMarkers.home = function () {
    var checkbox = document.getElementById('home-checkbox');
    if (checkbox.checked) {
      sdk.showMarkers([markers[0].id]);
    } else {
      sdk.hideMarkers([markers[0].id]);
    }
  };

  setMarkers.pizza = function () {
    var checkbox = document.getElementById('pizza-checkbox');
    if (checkbox.checked) {
      sdk.showMarkers([markers[1].id]);
    } else {
      sdk.hideMarkers([markers[1].id]);
    }
  };
}

document.addEventListener('DOMContentLoaded', main);
