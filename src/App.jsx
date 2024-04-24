import { useState, useEffect } from "react";
import "./App.css";
import { FaMagnifyingGlass } from "react-icons/fa6";
import axios from "axios";

// Spinner component
function Spinner() {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
    </div>
  );
}

function App() {
  // Function to get current time
  function getCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0"); // Ensuring minutes are always two digits
    const seconds = now.getSeconds().toString().padStart(2, "0"); // Ensuring seconds are always two digits

    // Determine if it's AM or PM
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    let formattedHours = hours % 12 || 12; // Handle midnight (0 hours)

    // Construct the time string
    const currentTime = `${formattedHours}:${minutes}:${seconds} ${ampm}`;

    return { currentTime, year };
  }

  // Get current time and year
  const { currentTime, year: currentYear } = getCurrentTime();

  // State variables
  const [inputCity, setInputCity] = useState("");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch current location
    const fetchCurrentLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Fetch weather data for current location
          getWeatherDetailsByCoordinates(latitude, longitude);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          setLoading(false);
        }
      );
    };

    // Fetch current location data initially
    fetchCurrentLocation();
  }, []);

  // Function to fetch weather details by coordinates
  const getWeatherDetailsByCoordinates = (latitude, longitude) => {
    const apiKey = "d68d124bfe565bf5078788ede377b708"; // API key for OpenWeatherMap
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    axios
      .get(apiURL)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching weather data:", err);
        setLoading(false);
      });
  };

  // Event handler for input change
  const handleChangeInput = (e) => {
    setInputCity(e.target.value);
  };

  // Function handler for search button click
  const handleSearch = () => {
    setLoading(true);
    getWeatherDetails(inputCity);
  };

  // mph to kmp
  const mphToKmh = (mph) => mph * 1.60934;

  // day time
  // Get the current date and time
  const currentDate = new Date();

  // Set the time to 7:00 PM
  currentDate.setHours(19, 0, 0, 0); // Hours are in 24-hour format, so 19 is 7:00 PM

  // Get the day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
  const dayOfWeek = currentDate.getDay();

  // Convert dayOfWeek to a string representation of the day
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentDay = daysOfWeek[dayOfWeek];

  // Function to fetch weather details for a given city
  const getWeatherDetails = (cityName) => {
    if (!cityName) return; // Return early if the cityName is empty

    // Construct the API URL for fetching weather data.
    const apiKey = "d68d124bfe565bf5078788ede377b708"; // API key for OpenWeatherMap
    const apiURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&appid=" +
      apiKey;

    // Make a GET request to the OpenWeatherMap API
    axios
      .get(apiURL)
      .then((res) => {
        console.log("response", res.data);
        setData(res.data); // Update the state with the response data.
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => {
        setLoading(false); // Set loading to false when the request is completed (whether successful or not)
      });
  };

  return (
    <div className="text-neutral-950">
      {/* header  */}
      <div className="h-[10vh] border-b px-4 items-center flex justify-between">
        <h1 className=" text-2xl font-semibold">Weather </h1>
        <div className="lg:w-60 bg-slate-50 py-1.5 px-2 rounded-md border flex items-center ">
          <input
            type="text"
            className="w-full bg-transparent outline-none"
            placeholder="Search city..."
            value={inputCity}
            onChange={handleChangeInput}
          />
          <button onClick={handleSearch}>
            <FaMagnifyingGlass />
          </button>
        </div>
      </div>

      {/* details */}
      {loading ? (
        <Spinner />
      ) : (
        <div className="p-4 mb-16 h-[80vh] overflow-auto flex flex-col gap-5">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <div className="border flex justify-center items-center px-4 rounded-md h-40 bg-slate-50 w-full">
              <h1 className="text-2xl font-semibold">
                {data?.name},{data?.sys?.country}
              </h1>
            </div>
            <div className="border flex flex-col justify-center items-center px-4 gap-1 rounded-md h-40 bg-slate-50 w-full">
              <h1 className="text-2xl font-semibold">Weather </h1>
              <p className="text-base font-medium">
                {currentDay}, {currentTime}
              </p>
              <p className="text-base font-medium">
                {data && data.weather && data.weather[0] && data.weather[0].main
                  ? data.weather[0].main
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="w-full">
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
              <div className="flex items-center justify-center flex-col gap-2 border rounded-md h-40 w-full bg-slate-50">
                <h1 className="text-2xl font-semibold">
                  {(data?.main?.temp_max - 273.15).toFixed(2)}°C
                </h1>
                <p className="text-base font-medium">High tomorrow</p>
              </div>
              <div className="flex items-center justify-center flex-col gap-2 border rounded-md h-40 w-full bg-slate-50">
                <h1 className="text-2xl font-semibold">
                  {(data?.main?.temp - 273.15).toFixed(2)}°C
                </h1>
                <p className="text-base font-medium">Temperature</p>
              </div>
              <div className="flex items-center justify-center flex-col gap-2 border rounded-md h-40 w-full bg-slate-50">
                <h1 className="text-2xl font-semibold">
                  {(data?.main?.feels_like - 273.15).toFixed(2)}°C
                </h1>
                <p className="text-base font-medium">Will feel like</p>
              </div>
              <div className="flex items-center justify-center flex-col gap-2 border rounded-md h-40 w-full bg-slate-50">
                <h1 className="text-2xl font-semibold">
                  {data && data.wind && data.wind.speed !== undefined
                    ? mphToKmh(data.wind.speed).toFixed(2) + " km/h"
                    : "N/A"}
                </h1>
                <p className="text-base font-medium">Wind speed</p>
              </div>
              <div className="flex items-center justify-center flex-col gap-2 border rounded-md h-40 w-full bg-slate-50">
                <h1 className="text-2xl font-semibold">
                  {data && data.main && data.main.humidity !== undefined
                    ? data.main.humidity.toFixed(2) + "%"
                    : "N/A"}
                </h1>
                <p className="text-base font-medium">Humidity</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* footer */}
      <div className="h-[10vh] fixed bottom-0 w-full p-4 border-t items-center flex justify-between">
        <p className="">
          {currentYear} {currentTime}
        </p>
        <a href="https://prabhat-singh.vercel.app" target="_/blank">
          © Prabhat Singh
        </a>
      </div>
    </div>
  );
}

export default App;
