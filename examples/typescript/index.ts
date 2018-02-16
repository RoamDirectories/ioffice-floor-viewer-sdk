import { FloorViewerSDK } from '@ioffice/floor-viewer-sdk';

function getById<T extends HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T;
}

// Utility objects to interact with the DOM
const ping: {
  roomById?: () => void,
  roomByName?: () => void,
} = {};
const select: {
  roomById?: () => void,
  roomByName?: () => void,
} = {};
const setMarkers: {
  home?: () => void,
  pizza?: () => void,
} = {};

/**
 * Return an object containing the query parameters.
 */
function getQueryParams() {
  const url = window.location.href;
  const query = {};
  const params = url.substr(url.lastIndexOf('?') + 1).split('&');
  params.forEach(function (item) {
    const [name, value] = item.split('=');
    query[decodeURIComponent(name)] = decodeURIComponent(value);
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
  const query = getQueryParams();

  // To create more floor-viewer you will need to create another container in the html file
  // and create another `FloorViewerSDK` that uses it. This allows you to have multiple
  // floor plans in the same place.
  const sdk = new FloorViewerSDK({
    siteUrl: query['siteUrl'],
    accessHeaders: getUserCredentials(query),
    floorId: query['floorId'],
    container: 'fv-container',
  });

  sdk.onReady().then(function () {
    sdk.getVersion().then(function (version) {
      console.log('Using VERSION:', version);
    });
    sdk.addMarkers(markers).then((ids) => {
      ids.forEach((id, index) => {
        markers[index]['id'] = id;
      });
    });
  });

  const markers = [
    {
      id: 0, // This value will be replaced once the marker is registered with the floor-viewer
      icon: 'home',
      markerColor: 'red',
      latlng: [-3.23046875, 4.28125]
    },
    {
      id: 0, // This value will be replaced once the marker is registered with the floor-viewer
      icon: 'pizza',
      markerColor: 'blue',
      latlng: [-4.8203125, 1.265625]
    }
  ];

  sdk.onRoomClick((event) => {
    // Missing types for the event. Will have to log it out at the moment to know what properties
    // the event will have.
    console.log('latlng: ', event['latlng']);
    const room = event['room'];
    const div = document.getElementById('map-info');
    if (!room) {
      div.innerHTML = 'No room was clicked ...';
      return;
    }
    const roomInfo = {
      id: room.id,
      name: room.name,
      users: room.users
    };
    let content = '<strong>Room Info</strong>';
    content += '<pre>' + JSON.stringify(roomInfo, null, 2) + '</pre>';
    div.innerHTML = content;
  });

  sdk.onFvError(function (event) {
    const div = document.getElementById('map-errors');
    const content = '<pre>' + JSON.stringify(event, null, 2) + '</pre>';
    div.innerHTML = content;
  });

  ping.roomById = () => {
    const roomId = +getById<HTMLInputElement>('input-room-id').value;
    if (roomId) {
      sdk.pingByRoomId(roomId);
    }
  };

  ping.roomByName = () => {
    const roomName = getById<HTMLInputElement>('input-room-name').value;
    if (roomName) {
      sdk.pingByRoomName(roomName, {
        duration: 10,
        color: [255, 0, 0],
      });
    }
  };

  select.roomById = function () {
    const roomId = +getById<HTMLInputElement>('select-room-id').value;
    if (roomId) {
      sdk.selectRoomById(roomId);
    } else {
      sdk.unselectRooms();
    }
  };

  select.roomByName = function () {
    const roomName = getById<HTMLInputElement>('select-room-name').value;
    if (roomName) {
      sdk.selectRoomByName(roomName);
    } else {
      sdk.unselectRooms();
    }
  };

  setMarkers.home = function () {
    const checkbox = getById<HTMLInputElement>('home-checkbox');
    if (checkbox.checked) {
      sdk.showMarkers([markers[0].id]);
    } else {
      sdk.hideMarkers([markers[0].id]);
    }
  };

  setMarkers.pizza = function () {
    const checkbox = getById<HTMLInputElement>('pizza-checkbox');
    if (checkbox.checked) {
      sdk.showMarkers([markers[1].id]);
    } else {
      sdk.hideMarkers([markers[1].id]);
    }
  };
}

document.addEventListener('DOMContentLoaded', main);
