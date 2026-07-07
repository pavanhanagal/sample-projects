# ForecastWebApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.8.

# ForecastWebApp (WeatherForecastApp)

This repository contains a small Angular web application and a backend WeatherForecast service used to demonstrate fetching and displaying weather forecast data.

Repository layout
- ForecastWebApp/ — Angular front-end application
- WeatherForecastService/ — .NET backend API service

Project overview
This is an Angular single-page application that consumes a WeatherForecast API. The front-end uses Angular modules for routing, HTTP access, forms, and a UI alert package (`@skyux/indicators`). The back-end is a simple ASP.NET Core Web API that exposes weather forecast endpoints used by the front-end.

Folder structure (key files)
- ForecastWebApp/
	- angular.json — Angular workspace configuration
	- package.json — front-end dependencies and scripts
	- src/
		- index.html — app host page
		- main.ts — application bootstrap
		- styles.scss — global styles
		- app/
			- app.module.ts — root Angular module (bootstraps `AppComponent`)
			- app-routing.module.ts — route definitions
			- app.component.* — root component files
			- weather-forecast/
				- weather-forecast.component.ts — component that fetches/displays forecasts
				- weather-forecast.component.html — UI for the forecast view
		- assets/ — static assets
		- interfaces/ — TypeScript interfaces (`item.ts`, `weatherForecast.ts`)
		- service/ — front-end services (e.g., `weatherForecast.service.ts`)

- WeatherForecastService/
	- Program.cs — .NET entry point
	- appsettings.json / appsettings.Development.json — configuration
	- WeatherForecastService.csproj — project file
	- Controllers/WeatherForecastController.cs — API controller exposing forecast endpoints
	- WeatherForecastModel.cs / Request/Response DTOs — model definitions

Key responsibilities
- `ForecastWebApp/src/app/app.module.ts`:
	- Imports `BrowserModule`, routing, `HttpClientModule`, `FormsModule`/`ReactiveFormsModule`, and `SkyAlertModule`.
	- Registers DI providers such as `provideClientHydration()` and `provideHttpClient()` depending on Angular version/features.
	- Bootstraps `AppComponent`. Note: ensure `WeatherForecastComponent` is declared or marked `standalone: true` as appropriate.

- `ForecastWebApp/src/app/weather-forecast/weather-forecast.component.ts`:
	- Uses an HTTP service to call the backend and render forecast results.

- `WeatherForecastService/Controllers/WeatherForecastController.cs`:
	- Provides endpoints that return forecast data used by the Angular app.

Setup & run (front-end)
1. Install dependencies:
```bash
npm install
```
2. Run dev server:
```bash
npm start
# or
ng serve
```
3. Build production bundle:
```bash
ng build --configuration production
```

Setup & run (back-end)
1. From the `WeatherForecastService` folder, restore and run (requires .NET SDK):
```powershell
# restore and run
dotnet restore
dotnet run --project WeatherForecastService.csproj
```

Environment & configuration
- Front-end: place API endpoints and keys in `src/environments/environment.ts` and `environment.prod.ts`.
- Back-end: configure connection strings and app settings in `appsettings.json` and environment-specific files.

Development notes & gotchas
- If `WeatherForecastComponent` is listed in `imports` inside `AppModule`, verify it is a `standalone: true` component. If not, move it to `declarations`.
- `provideClientHydration()` and `provideHttpClient()` are newer Angular APIs—ensure your Angular version supports them. Alternatively, use `HttpClientModule` consistently.
- Remove unused imports such as `isStandalone` if they are not used to avoid lint warnings.

Troubleshooting
- CORS: when running front-end and back-end separately, enable CORS on the API or run both on a shared origin.
- API connectivity: confirm the front-end endpoint URL matches the back-end host/port.

Testing
- Front-end tests (if present) run with:
```bash
npm test
```
- Back-end tests (if you add them) run with `dotnet test`.

Next steps
- Confirm the component registration in `src/app/app.module.ts` (declarations vs standalone).
- Add environment examples, screenshots, and contribution guidelines if you plan to share the project.

Contact / Contributing
Open issues or pull requests in this repository for fixes or improvements. Include reproduction steps and environment details.

---
Generated on 2026-01-09.
