import { useState } from 'react'
import './App.css'

function App() {

  // const apiKey = "d68d124bfe565bf5078788ede377b708"; // API key for OpenWeatherMap
  // const [inputCity, setInputCity] = useState(""); // State for storing the input city name
  // const [data, setData] = useState({}); // State for storing weather data

  // // Function to fetch weather details for a given city

  // const getWetherDetails = (cityName) => {
  //   if (!cityName) return; // Return early if the cityName is empty

  //   // Construct the API URL for fetching weather data.

  //   const apiURL =
  //     "https://api.openweathermap.org/data/2.5/weather?q=" +
  //     cityName +
  //     "&appid=" +
  //     apiKey;

  //   // Make a GET request to the OpenWeatherMap API

  //   axios
  //     .get(apiURL)
  //     .then((res) => {
  //       console.log("response", res.data);
  //       setData(res.data); // Update the state with the response data.
  //     })
  //     .catch((err) => {
  //       console.log("err", err);
  //     });
  // };

  // // Event handler for input change

  // const handleChangeInput = (e) => {
  //   // console.log("value", e.target.value);
  //   setInputCity(e.target.value); // Update the inputCity state with the new value
  // };

  // // Function handler for search button click

  // const handleSearch = () => {
  //   getWetherDetails(inputCity); // Call the getWeatherDetails function with the input city.
  // };
  return (
    <div className=''>
      
    </div>
  )
}

export default App
