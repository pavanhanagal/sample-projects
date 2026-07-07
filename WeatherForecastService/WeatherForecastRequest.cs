namespace WeatherForecastService
{
    public class WeatherForecastRequest
    {
        public string Latitude { get; set; }
        public string Longitude { get; set; }   
        public string Mode { get; set; }
        public string TemperatureUnit { get; set; }
        public string PrecipitationUnit {  get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
    }
}
