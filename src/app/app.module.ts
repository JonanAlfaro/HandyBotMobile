import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

// import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient , HttpClientModule} from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'http://192.168.100.251:12345', options: {} };



@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(),HttpClientModule, SocketIoModule.forRoot(config),],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy,
  },provideHttpClient()],
  bootstrap: [AppComponent],
})
export class AppModule {}



