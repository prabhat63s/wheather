/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import "./App.css";
import { FaMagnifyingGlass } from "react-icons/fa6";
import axios from "axios";

// Spinner component
const Spinner = () => (
  <div className="spinner-container">
    <div className="spinner"></div>
  </div>
);

// Speech Synthesis Function with Debugging
const speak = (text) => {
  if (!("speechSynthesis" in window)) {
    console.error("Your browser does not support speech synthesis.");
    return;
  }

  if (!text) {
    console.error("No text provided for speech synthesis.");
    return;
  }

  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";

  speech.onend = () => console.log("Speech synthesis finished.");
  speech.onerror = (e) => console.error("Speech synthesis error:", e);

  window.speechSynthesis.speak(speech);
};

const App = () => {
  // Function to get current time
  const getCurrentTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const currentTime = `${formattedHours}:${minutes} ${ampm}`;
    return { currentTime, year };
  };

  const { currentTime, year: currentYear } = getCurrentTime();
  const [inputCity, setInputCity] = useState("");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getWeatherDetailsByCoordinates(latitude, longitude);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          setLoading(false);
        }
      );
    };
    fetchCurrentLocation();
  }, []);

  const getWeatherDetailsByCoordinates = (latitude, longitude) => {
    const apiKey = "d68d124bfe565bf5078788ede377b708";
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
    axios
      .get(apiURL)
      .then((res) => {
        setData(res.data);
        setLoading(false);
        readWeatherInfo(res.data);
      })
      .catch((err) => {
        console.error("Error fetching weather data:", err);
        setLoading(false);
      });
  };

  const handleChangeInput = (e) => setInputCity(e.target.value);

  const handleSearch = () => {
    setLoading(true);
    getWeatherDetails(inputCity);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const mphToKmh = (mph) => (mph * 1.60934).toFixed(2) + " km/h";

  const readWeatherInfo = (data) => {
    const { name, sys, weather, main, wind, visibility } = data;
    const weatherDescription = weather[0]?.main || "N/A";
    const temperature = (main?.temp - 273.15).toFixed(2) + "°C";
    const feelsLike = (main?.feels_like - 273.15).toFixed(2) + "°C";
    const windSpeed = mphToKmh(wind?.speed);
    const humidity = main?.humidity + "%";
    const visibilityKm = visibility
      ? (visibility / 1000).toFixed(2) + " km"
      : "N/A";
    const timezone =
      data.timezone !== undefined
        ? `UTC ${data.timezone / 3600}, ${sys?.country}`
        : "N/A";
    const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const sunset = new Date(sys.sunset * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const text = `
      Weather information for ${name}, ${sys?.country}. 
      Current weather is ${weatherDescription}. 
      Temperature is ${temperature}. 
      Feels like ${feelsLike}. 
      Wind speed is ${windSpeed}. 
      Humidity is ${humidity}. 
      Visibility is ${visibilityKm}. 
      Sunrise at ${sunrise}. 
      Sunset at ${sunset}. 
      Timezone is ${timezone}.
    `;
    speak(text);
  };

  const getWeatherDetails = (cityName) => {
    if (!cityName) return;
    const apiKey = "d68d124bfe565bf5078788ede377b708";
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
    axios
      .get(apiURL)
      .then((res) => {
        setData(res.data);
        readWeatherInfo(res.data);
      })
      .catch((err) => console.log("err", err))
      .finally(() => setLoading(false));
  };

  const currentDate = new Date();
  currentDate.setHours(19, 0, 0, 0);
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentDay = daysOfWeek[currentDate.getDay()];

  useEffect(() => {
    const handleDivClick = () => {
      readWeatherInfo(data);
    };
  
    const weatherDetailsDiv = document.getElementById("weather-details");
    if (weatherDetailsDiv) {
      weatherDetailsDiv.addEventListener("click", handleDivClick);
  
      return () => {
        weatherDetailsDiv.removeEventListener("click", handleDivClick);
      };
    }
  }, [data]);
  

  return (
    <div className="text-neutral-950">
      <div className="h-[10vh] border-b px-4 items-center flex justify-between bg-white">
        <h1 className="text-2xl font-semibold">Weather</h1>
        <div className="lg:w-60 bg-slate-50 py-1.5 px-2 rounded-md border flex items-center">
          <input
            type="text"
            className="w-full bg-transparent outline-none"
            placeholder="Search city..."
            value={inputCity}
            onChange={handleChangeInput}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSearch}>
            <FaMagnifyingGlass />
          </button>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div
          id="weather-details"
          className="p-4 mb-16 h-[80vh] overflow-auto flex flex-col gap-5"
        >
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
            <div className="border flex justify-center flex-col items-center px-4 rounded-md h-40 bg-slate-50 w-full">
              <h1 className="text-2xl font-semibold">
                {data?.name},{data?.sys?.country}
              </h1>
              <div className="flex gap-2">
                <p className="text-base font-medium">
                  Latitude: {data?.coord.lat}
                </p>
                <p className="text-base font-medium">
                  Longitude: {data?.coord.lon}
                </p>
              </div>
            </div>
            <div className="border flex flex-col justify-center items-center px-4 gap-1 rounded-md h-40 bg-slate-50 w-full">
              <h1 className="text-2xl font-semibold">Weather</h1>
              <p className="text-base font-medium">
                {currentDay}, {currentTime}
              </p>
              <p className="text-base font-medium">
                {data?.weather?.[0]?.main || "N/A"}
              </p>
            </div>
            <div className="flex items-center justify-center flex-col gap-2 border rounded-md h-40 w-full bg-slate-50">
              <h1 className="text-2xl font-semibold">
                {data?.timezone !== undefined
                  ? `UTC ${data.timezone / 3600}, ${data.sys?.country}`
                  : "N/A"}
              </h1>
              <p className="text-base font-medium">Timezone</p>
            </div>
          </div>

          <div className="w-full">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <WeatherDetail
                label="Sunrise"
                value={
                  data?.sys?.sunrise
                    ? new Date(data.sys.sunrise * 1000).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        }
                      )
                    : "N/A"
                }
              />
              <WeatherDetail
                label="Sunset"
                value={
                  data?.sys?.sunset
                    ? new Date(data.sys.sunset * 1000).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        }
                      )
                    : "N/A"
                }
              />
              <WeatherDetail
                label="High tomorrow"
                value={`${(data?.main?.temp_max - 273.15).toFixed(2)}°C`}
              />
              <WeatherDetail
                label="Temperature"
                value={`${(data?.main?.temp - 273.15).toFixed(2)}°C`}
              />
              <WeatherDetail
                label="Will feel like"
                value={`${(data?.main?.feels_like - 273.15).toFixed(2)}°C`}
              />
              <WeatherDetail
                label="Wind speed"
                value={
                  data?.wind?.speed !== undefined
                    ? mphToKmh(data.wind.speed)
                    : "N/A"
                }
              />
              <WeatherDetail
                label="Humidity"
                value={`${data?.main?.humidity || "N/A"}%`}
              />
              <WeatherDetail
                label="Visibility"
                value={
                  data?.visibility !== undefined
                    ? `${(data.visibility / 1000).toFixed(2)} km`
                    : "N/A"
                }
              />
            </div>
          </div>
        </div>
      )}

      <div className="h-[10vh] fixed bottom-0 w-full p-4 border-t items-center flex justify-between bg-white">
        <p>
          {currentYear} {currentTime}
        </p>
        <a href="https://prabhat-singh-portfolio.vercel.app/" target="_/blank">
          © Prabhat Singh
        </a>
      </div>
    </div>
  );
};

const WeatherDetail = ({ label, value }) => (
  <div className="flex items-center justify-center flex-col gap-2 border rounded-md h-40 w-full bg-slate-50">
    <h1 className="text-2xl font-semibold">{value}</h1>
    <p className="text-base font-medium">{label}</p>
  </div>
);

export default App;
