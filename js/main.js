// First create a config.js file you can use the example_config.js
import { apiKey, baseURL } from "./config.js";

let timer;

const getForecastWeather = (location) => {
  return fetch(`${baseURL}forecast.json?key=${apiKey}&q=${location}&lang=nl`);
};

const onSearch = (event) => {
  if (event.key === "Enter" && event.currentTarget.value.length > 0) {
    loadWeather(event.currentTarget.value);
  }
};

const loadWeather = async (location) => {
  try {
    // Code will continue if the call returns as a 200 OK
    const data = await getForecastWeather(location);
    const jsonData = await data.json();
    parseData(jsonData);
  } catch (e) {
    // Did not return a 200 OK
    console.error(e);
  }
};

const parseData = (jsonData) => {
  console.log(jsonData.location);
  console.log(jsonData.current);
  console.log(jsonData.forecast);
  document.getElementById("location-name").innerHTML = jsonData.location.name;
  document.getElementById("location-region").innerHTML =
    jsonData.location.region;
  // Replacing all the 64 number with 128
  document.getElementById(
    "current-condition-icon"
  ).src = jsonData.current.condition.icon.replace(/64/g, "128");
  document.getElementById("current-condition-text").innerHTML =
    jsonData.current.condition.text;
  document.getElementById("current-temp-c").innerHTML = jsonData.current.temp_c;
  document.getElementById("current-feelslike-c").innerHTML =
    jsonData.current.feelslike_c;
  document.getElementById("current-wind-kph").innerHTML =
    jsonData.current.wind_kph;
  document.getElementById("current-wind-dir").innerHTML =
    jsonData.current.wind_dir;
  // -90 because the arrow already points to the right east.
  document.getElementById("current-wind-degree").style.transform = `rotate(${
    jsonData.current.wind_degree - 90
  }deg)`;
  document.getElementById("current-humidity").innerHTML =
    jsonData.current.humidity;

  const forecastDay = jsonData.forecast.forecastday;
  if (forecastDay && forecastDay.length > 0) {
    const current = forecastDay[0]; // Getting today which is on the first place.
    const currentHour = new Date().getHours();
    if (currentHour < current.hour.length) {
      // Resetting the forecast element
      const forecastEl = document.getElementById("forecast");
      forecastEl.innerHTML = `<li>
            <p>Time</p>
            <p><sup>o</sup>C</p>
            <p>km<span>p/u</span></p>
            <p>
                <ion-icon name="send" class="north-west"></ion-icon>
            </p>
            <p>%</p>
        </li>`;
      for (let i = currentHour; i < current.hour.length; i += 1) {
        const data = current.hour[i];
        const listItem = document.createElement("li");
        listItem.innerHTML = `<p>${new Date(data.time).getHours()}:00</p>
          <p>${data.temp_c}</p>
          <p>${data.wind_kph}</p>
          <p>${data.wind_dir}</p>
          <p>${data.humidity}</p>`;
        forecastEl.append(listItem);
      }
    }
  }
};

const updateTime = () => {
  const timeEl = document.getElementById("header");
  timeEl.innerText = new Date().toUTCString();
};

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(loadPosition);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function loadPosition(position) {
  console.log(
    "Latitude: " +
      position.coords.latitude +
      "Longitude: " +
      position.coords.longitude
  );
  loadWeather(`${position.coords.latitude},${position.coords.longitude}`);
}

window.addEventListener("load", async () => {
  document.getElementById("search").addEventListener("keypress", onSearch);
  setInterval(() => {
    updateTime();
  }, 1000);
  getLocation();
});
