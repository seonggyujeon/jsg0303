import type {ConditionsAdapter,EnvironmentalObservation} from "./contracts";

export const OPEN_METEO_WEATHER_DOCS="https://open-meteo.com/en/docs";
export const OPEN_METEO_MARINE_DOCS="https://open-meteo.com/en/docs/marine-weather-api";

type WeatherResponse={
  current:{time:string;interval:number;temperature_2m:number;precipitation:number;wind_speed_10m:number};
  current_units?:Record<string,string>;
};
type MarineResponse={
  current:{time:string;interval:number;wave_height:number;sea_surface_temperature:number};
  current_units?:Record<string,string>;
};

function record(value:unknown,label:string):Record<string,unknown>{if(!value||typeof value!=="object"||Array.isArray(value))throw new Error(`${label} is not an object`);return value as Record<string,unknown>}
function text(value:unknown,label:string){if(typeof value!=="string")throw new Error(`${label} is not a string`);return value}
function number(value:unknown,label:string){if(typeof value!=="number"||!Number.isFinite(value))throw new Error(`${label} is not a finite number`);return value}

export function parseWeatherResponse(payload:unknown):WeatherResponse{
  const root=record(payload,"weather response");const current=record(root.current,"weather.current");
  return {current:{time:text(current.time,"weather.current.time"),interval:number(current.interval,"weather.current.interval"),temperature_2m:number(current.temperature_2m,"weather.current.temperature_2m"),precipitation:number(current.precipitation,"weather.current.precipitation"),wind_speed_10m:number(current.wind_speed_10m,"weather.current.wind_speed_10m")}};
}

export function parseMarineResponse(payload:unknown):MarineResponse{
  const root=record(payload,"marine response");const current=record(root.current,"marine.current");
  return {current:{time:text(current.time,"marine.current.time"),interval:number(current.interval,"marine.current.interval"),wave_height:number(current.wave_height,"marine.current.wave_height"),sea_surface_temperature:number(current.sea_surface_temperature,"marine.current.sea_surface_temperature")}};
}

async function json(response:Response,label:string){if(!response.ok)throw new Error(`${label} returned HTTP ${response.status}`);return response.json() as Promise<unknown>}

export const openMeteoAdapter:ConditionsAdapter={
  id:"open-meteo",
  async getCurrent({latitude,longitude}):Promise<EnvironmentalObservation>{
    const weather=new URL("https://api.open-meteo.com/v1/forecast");weather.search=new URLSearchParams({latitude:String(latitude),longitude:String(longitude),current:"temperature_2m,precipitation,wind_speed_10m",wind_speed_unit:"ms",timezone:"Asia/Seoul"}).toString();
    const marine=new URL("https://marine-api.open-meteo.com/v1/marine");marine.search=new URLSearchParams({latitude:String(latitude),longitude:String(longitude),current:"wave_height,sea_surface_temperature",timezone:"Asia/Seoul"}).toString();
    const [weatherResponse,marineResponse]=await Promise.all([fetch(weather),fetch(marine)]);
    const [weatherData,marineData]=await Promise.all([json(weatherResponse,"Open-Meteo Weather API"),json(marineResponse,"Open-Meteo Marine API")]);
    const weatherCurrent=parseWeatherResponse(weatherData).current;const marineCurrent=parseMarineResponse(marineData).current;
    return {temperature:weatherCurrent.temperature_2m,precipitation:weatherCurrent.precipitation,windSpeed:weatherCurrent.wind_speed_10m,waveHeight:marineCurrent.wave_height,waterTemperature:marineCurrent.sea_surface_temperature,weatherObservedAt:weatherCurrent.time,marineObservedAt:marineCurrent.time,providers:[{id:"open-meteo-weather",label:"Open-Meteo Weather API",documentationUrl:OPEN_METEO_WEATHER_DOCS},{id:"open-meteo-marine",label:"Open-Meteo Marine API",documentationUrl:OPEN_METEO_MARINE_DOCS}]};
  }
};
