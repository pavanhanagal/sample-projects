import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class WeatherForecastService{
    private clientUrl : string; 

    constructor(private _httpClient:HttpClient)
    {
        this.clientUrl = "https://localhost:7156/WeatherForecast/GetMeteoWeatherForecast";
    }
    getWeatherForecast(lat : string, lang : string, myOption : string, tempartureUnit : string, precipitationUnit : string, startDate: string, endDate : string) {
        const body: any = 
        {   
            "latitude": lat, 
            "longitude":lang, 
            "mode": myOption,
            "temperatureUnit": tempartureUnit,
            "precipitationUnit" : precipitationUnit,
            "startDate": startDate,
            "endDate": endDate,
        };  
        return this._httpClient.post(this.clientUrl, body);         
    }    
}