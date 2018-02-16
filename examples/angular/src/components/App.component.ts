import { Component, AfterContentInit, ViewChild, ElementRef } from '@angular/core';
// import { FloorViewerSDK } from '@ioffice/floor-viewer-sdk';
declare var FloorViewerSDK: any;

@Component({
  selector: 'app',
  template: `
    <div class="container theme-showcase" role="main">
      <header></header>
      <div class="row">
        <div class="col-md-4">
          <panel title="Ping by Room">
            <input-button name="Id" (inputChange)="pingById($event)"></input-button><br>
            <input-button name="Name" (inputChange)="fv.pingByRoomName($event)"></input-button>
          </panel>
          <panel title="Select by Room">
            <input-button name="Id" (inputChange)="fv.selectRoomById($event)"></input-button><br>
            <input-button name="Name" (inputChange)="fv.selectRoomByName($event)"></input-button>
          </panel>
          <panel title="Map Information">
            <div [innerHTML]="roomInfo"></div>
          </panel>
          <panel title="FloorViewer Errors" type="danger">
            <div [innerHTML]="fvErrors"></div>
          </panel>
          <panel title="Markers">
             WIP
          </panel>
        </div>
        <div #fvContainer class="col-md-8 fvContainer"></div>
      </div>
    </div>
  `,
  styles: [`
    .fvContainer {
      height: 500px;
    }
  `],
})
class AppComponent implements AfterContentInit {
  fv: FloorViewerSDK;
  @ViewChild('fvContainer') fvContainer: ElementRef;
  roomInfo: string = 'Click on a room ...';
  fvErrors: string = `
    This panel displays errors thrown by the map.
    For instance, try selecting a room which is not in the map.
  `;

  markers: any = [
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

  otherMarker: any = [{
      icon: 'pizza',
      markerColor: 'green',
      latlng: [-3.8203125, 1.265625]
    }];

  log(data: string) {
    console.log(data);
  }

  ngAfterContentInit() {
    const query = this.getQueryParams();
    this.fv = new FloorViewerSDK({
      siteUrl: query.siteUrl,
      accessHeaders: this.getUserCredentials(query),
      floorId: query.floorId,
      container: this.fvContainer.nativeElement,
    });

    this.fv.onReady().then(() => {
      // Adding timeout for now because of an issue with the SDK (to be fixed in next release)
      setTimeout(() => {
        console.log('FV', this.fv);
        this.fv.getVersion().then((version) => {
          console.log('Using VERSION:', version);
        });
        console.log('markers:', this.markers);
        this.fv.addMarkers(this.markers).then((ids) => {
          ids.forEach((id, index) => {
            this.markers[index].id = id;
          });
        });

        setTimeout(() => {
          console.log('Late update');
          this.fv.addMarkers(this.otherMarker).then((ids) => {
            console.log('new marker:', ids);
          }).catch(err => {
            console.log('Late catch error:', err);
          })

        }, 5000);
      }, 1000);
    });

    this.fv.onRoomClick((event) => {
      // Missing types for the event, using `[]` to avoid the typescript errors for now
      console.log('click event', event);
      const room = event['room'];
      if (!room) {
        this.roomInfo = 'No room was clicked ...';
        return;
      }
      const roomInfo = {
        id: room.id,
        name: room.name,
        users: room.users
      };
      this.roomInfo = `
        <strong>Room Info</strong>
        <pre>${JSON.stringify(roomInfo, null, 2)}</pre>
      `;
    });

    this.fv.onFvError((event) => {
      this.fvErrors = `<pre>${JSON.stringify(event, null, 2)}</pre>`;
    });
  }

  /**
   * Simple wrapper to ping a room by id. This method can be avoided and instead call directly
   * on the template. The downside is that we lose the autocompletion from the IDE if we do that.
   * @param id
   */
  pingById(id: number) {
    // If we needed to we can pass in options here. There are no types for options yet, those will
    // come in future releases.
    this.fv.pingByRoomId(id);
  }

  getUserCredentials(query: any): any {
    const credentials = {};
    if (query.token) {
      credentials['x-access-token'] = query.token;
    } else {
      throw Error('missing user credentials, provide [token] query.');
    }
    return credentials;
}

  getQueryParams(): any {
    const url = window.location.href;
    const query = {};
    const params = url.substr(url.lastIndexOf('?') + 1).split('&');
    params.forEach((item) => {
      const col = item.split('=');
      query[decodeURIComponent(col[0])] = decodeURIComponent(col[1]);
    });
    return query;
  }
}

export {
  AppComponent,
};
