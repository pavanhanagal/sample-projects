using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Globalization;

namespace WeatherForecastService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpPost("GetMeteoWeatherForecast")]
        public async Task<List<WeatherDailyForecast>> GetMeteoWeatherForecast([FromBody] WeatherForecastRequest weatherForecastRequest)
        {
            var startDate = DateTime.Now.ToString("yyyy-MM-dd");
            System.TimeSpan duration = new System.TimeSpan(6, 0, 0, 0);
            var endDate = Convert.ToDateTime(startDate).Date.Add(duration).ToString("yyyy-MM-dd");
            if (!string.IsNullOrEmpty(weatherForecastRequest.StartDate) && !string.IsNullOrEmpty(weatherForecastRequest.EndDate))
            {
                startDate = weatherForecastRequest.StartDate;
                endDate = weatherForecastRequest.EndDate;
            }

            string baseAddress = $"https://api.open-meteo.com/v1/forecast?";
            Uri uri = new Uri(baseAddress);
            HttpClient client = new HttpClient();           
            
            if (weatherForecastRequest.TemperatureUnit == "degreecelisus")
            {
                return await GetDailyHourlyWeatherAsync(weatherForecastRequest, client, uri);
            }
            if (weatherForecastRequest.TemperatureUnit.ToLower() == "degreefahrenheit")
            {
                return await GetDailyHourlyWeatherAsync(weatherForecastRequest, client, uri);
            }            
            else { return new List<WeatherDailyForecast>(); }
    

        }

        private string GetDayWiseAverageHumidity(WeatherForecastModel weatherForecastModel, string date)
        {
            int relativeHumidity = 0;

            if (weatherForecastModel != null)
            {
                for (int i = 0; i < weatherForecastModel.hourly.time.Length; i++)
                {
                    if (weatherForecastModel.hourly.time[i].Contains(date))
                    {
                        relativeHumidity += weatherForecastModel.hourly.relative_humidity_2m[i];
                    }
                }
            }
            return Convert.ToString(relativeHumidity / 24);
        }

        private async Task<List<WeatherDailyForecast>> GetDailyHourlyWeatherAsync(WeatherForecastRequest weatherForecastRequest, HttpClient client, Uri uri)
        {
            var weatherDailyForecastList = new List<WeatherDailyForecast>();    

            if (weatherForecastRequest.Mode.ToLower() == "daily")
            {
                string formattedDailyURL = $"{uri}latitude={weatherForecastRequest.Latitude}&longitude={weatherForecastRequest.Longitude}&start_date={weatherForecastRequest.StartDate}&end_date={weatherForecastRequest.EndDate}&hourly=relative_humidity_2m&current=relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,precipitation_probability_max&timezone=auto";

                if (weatherForecastRequest.TemperatureUnit.ToLower().Equals("degreefahrenheit"))
                {
                    formattedDailyURL += "&temperature_unit=fahrenheit";
                }

                if (weatherForecastRequest.PrecipitationUnit.ToLower().Equals("precipitationunitinch"))
                {
                    formattedDailyURL += "&precipitation_unit=inch";
                }

                HttpResponseMessage response = await client.GetAsync(formattedDailyURL);

                var weatherDataModel = JsonConvert.DeserializeObject<WeatherForecastModel>(response.Content.ReadAsStringAsync().Result);

                for (int i = 0; i < weatherDataModel?.daily.time.Length; i++)
                {
                    WeatherDailyForecast weatherForecastResponse = new();
                    weatherForecastResponse.Date = Convert.ToDateTime(weatherDataModel.daily.time[i]).ToShortDateString(); 
                    weatherForecastResponse.HighTemperature = weatherDataModel?.daily.temperature_2m_max[i] + weatherDataModel?.daily_units.temperature_2m_max;
                    weatherForecastResponse.LowTemperature = weatherDataModel?.daily.temperature_2m_min[i] + weatherDataModel?.daily_units.temperature_2m_min;
                    weatherForecastResponse.HighApparentTemperature = weatherDataModel?.daily.apparent_temperature_max[i] + weatherDataModel?.daily_units.apparent_temperature_max;
                    weatherForecastResponse.LowApparentTemperature = weatherDataModel?.daily.apparent_temperature_min[i] + weatherDataModel?.daily_units.apparent_temperature_min;
                    weatherForecastResponse.PrecipitationProbablity = weatherDataModel?.daily.precipitation_probability_max[i] + weatherDataModel?.daily_units.precipitation_probability_max;
                    weatherForecastResponse.Precipitation = weatherDataModel?.daily.precipitation_sum[i] + weatherDataModel?.daily_units.precipitation_sum;
                    weatherForecastResponse.AverageRelativeHumidity = GetDayWiseAverageHumidity(weatherDataModel, weatherDataModel.daily.time[i]) + weatherDataModel.hourly_units.relative_humidity_2m;
                    weatherDailyForecastList.Add(weatherForecastResponse);
                }
            }
            if (weatherForecastRequest.Mode.ToLower() == "hourly")
            {
                string formattedHourlyURL = $"{uri}latitude={weatherForecastRequest.Latitude}&longitude={weatherForecastRequest.Longitude}&start_date={weatherForecastRequest.StartDate}&end_date={weatherForecastRequest.EndDate}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation&timezone=auto";
                if (weatherForecastRequest.TemperatureUnit.ToLower().Equals("degreefahrenheit"))
                {
                    formattedHourlyURL += "&temperature_unit=fahrenheit";
                }

                if (weatherForecastRequest.PrecipitationUnit.ToLower().Equals("precipitationunitinch"))
                {
                    formattedHourlyURL += "&precipitation_unit=inch";
                }

                HttpResponseMessage response =
                    await client.GetAsync(formattedHourlyURL);

                var weatherDataModel = JsonConvert.DeserializeObject<WeatherForecastModel>(response.Content.ReadAsStringAsync().Result);

                for (int i = 0; i < weatherDataModel?.hourly.time.Length; i++)
                {
                    WeatherDailyForecast weatherForecastResponse = new();
                    weatherForecastResponse.Date = Convert.ToDateTime(weatherDataModel.hourly.time[i]).ToString();
                    weatherForecastResponse.HighTemperature = weatherDataModel?.hourly.temperature_2m[i] + weatherDataModel?.hourly_units.temperature_2m;
                    weatherForecastResponse.LowTemperature = weatherDataModel?.hourly.temperature_2m[i] + weatherDataModel?.hourly_units.temperature_2m;
                    weatherForecastResponse.HighApparentTemperature = weatherDataModel?.hourly.apparent_temperature[i] + weatherDataModel?.hourly_units.apparent_temperature;
                    weatherForecastResponse.LowApparentTemperature = weatherDataModel?.hourly.apparent_temperature[i] + weatherDataModel?.hourly_units.apparent_temperature;
                    weatherForecastResponse.PrecipitationProbablity = weatherDataModel?.hourly.precipitation_probability[i] + weatherDataModel?.hourly_units.precipitation_probability;
                    weatherForecastResponse.Precipitation = weatherDataModel?.hourly.precipitation[i] + weatherDataModel?.hourly_units.precipitation;
                    weatherForecastResponse.AverageRelativeHumidity = weatherDataModel?.hourly.relative_humidity_2m[i] + weatherDataModel?.hourly_units.relative_humidity_2m;
                    weatherDailyForecastList.Add(weatherForecastResponse);
                }
            }
            return weatherDailyForecastList;
        }
    }
}
