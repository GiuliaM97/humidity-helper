import {fetchWeatherApi} from "openmeteo";

const apiKey = "58d3142bb5b645cfa0993302262405";
const baseURL = "http://api.weatherapi.com/v1";



export async function loadCurrentData() {
  const constructedURL = `${baseURL}/current.json?key=${apiKey}&q=Parma&qi=no`;
  const response = await fetch(constructedURL);
  return response.json();
}
