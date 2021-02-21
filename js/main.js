// First create a config.js file you can use the example_config.js
import { apiKey, baseURL } from "./config.js";

let timer;

const getForecastWeather = async (location) => {
  const data = await fetch(
    `${baseURL}forecast.json?key=${apiKey}&q=${location}&lang=nl`
  );
  return data.json();
};

const onSearch = (event) => {
  if (event.key === "Enter" && event.currentTarget.value.length > 0) {
    loadWeather(event.currentTarget.value);
  }
};

const loadWeather = async (location) => {
  try {
    // Code will continue if the call returns as a 200 OK
    const jsonData = await getForecastWeather(location);
    parseData(jsonData);
  } catch (e) {
    // Did not return a 200 OK
    console.error(e);
  }
};

const parseData = (jsonData) => {
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
      forecastEl.innerHTML = "";
      forecastEl.append(getForecastHeader());
      for (let i = currentHour; i < current.hour.length; i += 1) {
        const data = current.hour[i];
        const listItem = document.createElement("li");
        listItem.append(
          createParagraph(`${new Date(data.time).getHours()}:00`)
        );
        listItem.append(createParagraph(`${data.temp_c}`));
        listItem.append(createParagraph(`${data.wind_kph}`));
        listItem.append(createParagraph(`${data.wind_dir}`));
        listItem.append(createParagraph(`${data.humidity}`));
        forecastEl.append(listItem);
      }
    }
  }
};

const getForecastHeader = () => {
  const listItem = document.createElement("li");
  listItem.append(createParagraph(`Time`));
  listItem.append(getCtemp());
  listItem.append(getKMpu());
  listItem.append(createParagraph(getIcon("send")));
  listItem.append(createParagraph(`%`));
  return listItem;
};

const getCtemp = () => {
  const sup = document.createElement("sup");
  sup.innerText = "o";
  const p = createParagraph("C");
  p.prepend(sup);
  return p;
};

const getKMpu = () => {
  const sup = document.createElement("sup");
  sup.innerText = "p/u";
  const p = createParagraph("km");
  p.append(sup);
  return p;
};

const getIcon = (iconType) => {
  const icon = document.createElement("ion-icon");
  icon.name = iconType;
  return icon;
};

const createParagraph = (text) => {
  const p = document.createElement("p");
  if (typeof text === "string") {
    p.innerText = text;
  } else if (typeof text === "object") {
    p.append(text);
  }
  console.log(typeof text);
  return p;
};

const updateTime = () => {
  const timeEl = document.getElementById("header");
  timeEl.innerText = new Date().toUTCString();
};

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(loadPosition);
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
};

const loadPosition = (position) => {
  loadWeather(`${position.coords.latitude},${position.coords.longitude}`);
};

window.addEventListener("load", async () => {
  document.getElementById("search").addEventListener("keypress", onSearch);
  setInterval(() => {
    updateTime();
  }, 1000);
  getLocation();
});
