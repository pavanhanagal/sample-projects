import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class WeatherForecastService {
    private readonly baseUrl = '/WeatherForecast';
    private readonly weatherUrl = `${this.baseUrl}/GetMeteoWeatherForecast`;
    private readonly demoUrl = `${this.baseUrl}/demo-items`;

    constructor(private readonly httpClient: HttpClient) {}

    getWeatherForecast(lat: string, lang: string, myOption: string, tempartureUnit: string, precipitationUnit: string, startDate: string, endDate: string) {
        const body: any = {
            latitude: lat,
            longitude: lang,
            mode: myOption,
            temperatureUnit: tempartureUnit,
            precipitationUnit: precipitationUnit,
            startDate: startDate,
            endDate: endDate,
        };
        return this.httpClient.post(this.weatherUrl, body);
    }

    getDemoItems() {
        return this.httpClient.get<any[]>(this.demoUrl);
    }

    createDemoItem(item: { name: string; description: string }) {
        return this.httpClient.post(this.demoUrl, item);
    }

    updateDemoItem(id: number, item: { name: string; description: string }) {
        return this.httpClient.put(`${this.demoUrl}/${id}`, item);
    }

    deleteDemoItem(id: number) {
        return this.httpClient.delete(`${this.demoUrl}/${id}`);
    }
}