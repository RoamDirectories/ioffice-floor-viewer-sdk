import { NgModule, enableProdMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './components/App.component';
import { HeaderComponent } from './components/Header.component';
import { PanelComponent } from './components/Panel.component';
import { InputButtonComponent } from './components/InputButton.component';

enableProdMode();
@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    PanelComponent,
    InputButtonComponent,
  ],
  bootstrap: [AppComponent],
  entryComponents: [AppComponent]
})
class AppModule { }

export { AppModule }
