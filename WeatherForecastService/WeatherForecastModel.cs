namespace WeatherForecastService
{
    public class WeatherForecastModel
    {
        public float latitude { get; set; }
        public float longitude { get; set; }
        public float generationtime_ms { get; set; }
        public int utc_offset_seconds { get; set; }
        public string timezone { get; set; }
        public string timezone_abbreviation { get; set; }
        public float elevation { get; set; }
        public Hourly_Units hourly_units { get; set; }
        public Hourly hourly { get; set; }
        public Daily_Units daily_units { get; set; }
        public Daily daily { get; set; }
    }

    public class Hourly_Units
    {
        public string time { get; set; }
        public string temperature_2m { get; set; }
        public string apparent_temperature { get; set; }        
        public string relative_humidity_2m { get; set; }
        public string precipitation { get; set; }
        public string precipitation_probability { get; set; }
    }

    public class Hourly
    {
        public string[] time { get; set; }
        public int[] relative_humidity_2m { get; set; }
        public float[] temperature_2m { get; set; }
        public float[] apparent_temperature { get; set; } 
        public float[] precipitation { get; set; }
        public int[] precipitation_probability { get; set; }
    }

    public class Daily_Units
    {
        public string time { get; set; }
        public string temperature_2m_max { get; set; }
        public string temperature_2m_min { get; set; }
        public string apparent_temperature_max { get; set; }
        public string apparent_temperature_min { get; set; }
        public string precipitation_sum { get; set; }
        public string precipitation_probability_max { get; set; }
    }

    public class Daily
    {
        public string[] time { get; set; }
        public float[] temperature_2m_max { get; set; }
        public float[] temperature_2m_min { get; set; }
        public float[] apparent_temperature_max { get; set; }
        public float[] apparent_temperature_min { get; set; }
        public float[] precipitation_sum { get; set; }
        public int[] precipitation_probability_max { get; set; }
    }
}
