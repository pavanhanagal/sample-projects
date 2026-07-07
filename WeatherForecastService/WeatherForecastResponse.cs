namespace WeatherForecastService
{
    public class WeatherDailyForecast
    {
        public string Date { get; set; }
        public string HighTemperature { get; set; }
        public string LowTemperature { get; set; }
        public string HighApparentTemperature { get; set; }
        public string LowApparentTemperature { get; set; }
        public string PrecipitationProbablity { get; set; }
        public string Precipitation { get; set; }
        public string AverageRelativeHumidity { get; set; }
    }
}
