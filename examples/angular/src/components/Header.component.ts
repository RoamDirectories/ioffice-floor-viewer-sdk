import { Component } from '@angular/core';

@Component({
  selector: 'header',
  template: `
    <div class="jumbotron">
      <h1>FloorViewer SDK - Plain JS</h1>
      <p>
        This document presents an example written in plain JS on how to
        embed and interact with the iOffice Floor-Viewer.
      </p>
    </div>
    <div class="page-header">
      <h1>Interaction</h1>
    </div>
  `,
  styles: [`
    .jumbotron {
      background-color: #DFEDF5;
    }
    .jumbotron h1 {
      color: #406F8D;
    }
  `],
})
class HeaderComponent {
}

export {
  HeaderComponent,
};
