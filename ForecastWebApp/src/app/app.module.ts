import { NgModule, isStandalone } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SkyAlertModule } from '@skyux/indicators';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { WeatherForecastComponent } from './weather-forecast/weather-forecast.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent       
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SkyAlertModule ,
    HttpClientModule,
    WeatherForecastComponent,
    FormsModule,
    ReactiveFormsModule 
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
