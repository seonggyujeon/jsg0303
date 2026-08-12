import {OPEN_METEO_MARINE_DOCS,OPEN_METEO_WEATHER_DOCS} from "../../../lib/adapters/open-meteo";
import {optionalRuntimeSecret} from "../../../lib/adapters/runtime-config";
import {TOUR_API_DOCS} from "../../../lib/adapters/tour-api";

export async function GET(){
  return Response.json({providers:[
    {id:"open-meteo-weather",purpose:"current weather forecast",configured:true,authentication:"none",documentationUrl:OPEN_METEO_WEATHER_DOCS,responsePath:"current.{time,interval,temperature_2m,precipitation,wind_speed_10m}"},
    {id:"open-meteo-marine",purpose:"current marine forecast",configured:true,authentication:"none",documentationUrl:OPEN_METEO_MARINE_DOCS,responsePath:"current.{time,interval,wave_height,sea_surface_temperature}"},
    {id:"kto-tour-api-4",purpose:"nearby tourism places",configured:Boolean(optionalRuntimeSecret("TOUR_API_SERVICE_KEY")),authentication:"TOUR_API_SERVICE_KEY",documentationUrls:TOUR_API_DOCS,responsePath:"response.header + response.body.items.item"},
    {id:"marine-activity-catalog",purpose:"marine activity inventory",configured:true,authentication:"none",source:"curated_d1",note:"Kept as curated data because no verified external activity availability API has been configured."}
  ]});
}
