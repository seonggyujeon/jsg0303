import { getDb } from "../db";
import { conditionSnapshots } from "../db/schema";

export type MarinePlace={id:string;latitude:number;longitude:number;baselineCrowd:number;activityKind?:string};
export type LiveCondition={temperature:number;precipitation:number;windSpeed:number;waveHeight:number;waterTemperature:number;crowdEstimate:number;observedAt:string;dataStatus:{weather:"live_forecast"|"fallback";marine:"live_forecast"|"fallback";crowd:"estimated"};sources:string[]};

function crowdEstimate(base:number,date=new Date()){
  const hour=date.getHours(); const weekend=[0,6].includes(date.getDay());
  const timeDelta=hour>=11&&hour<=17?12:hour>=18&&hour<=21?7:-7;
  return Math.max(5,Math.min(95,base+(weekend?10:0)+timeDelta));
}

export async function getLiveCondition(place:MarinePlace):Promise<LiveCondition>{
  const weatherUrl=`https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,precipitation,wind_speed_10m&wind_speed_unit=ms&timezone=Asia%2FSeoul`;
  const marineUrl=`https://marine-api.open-meteo.com/v1/marine?latitude=${place.latitude}&longitude=${place.longitude}&hourly=wave_height,sea_surface_temperature&forecast_days=1&timezone=Asia%2FSeoul`;
  const [weatherResponse,marineResponse]=await Promise.all([fetch(weatherUrl),fetch(marineUrl)]);
  if(!weatherResponse.ok||!marineResponse.ok) throw new Error("Live condition provider unavailable");
  const weather=await weatherResponse.json() as any; const marine=await marineResponse.json() as any;
  const now=new Date(); const target=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}T${String(now.getHours()).padStart(2,"0")}:00`;
  const index=Math.max(0,marine.hourly.time.indexOf(target));
  const result:LiveCondition={temperature:weather.current.temperature_2m,precipitation:weather.current.precipitation,windSpeed:weather.current.wind_speed_10m,waveHeight:marine.hourly.wave_height[index]??0,waterTemperature:marine.hourly.sea_surface_temperature[index]??0,crowdEstimate:crowdEstimate(place.baselineCrowd,now),observedAt:new Date().toISOString(),dataStatus:{weather:"live_forecast",marine:"live_forecast",crowd:"estimated"},sources:["Open-Meteo Weather API","Open-Meteo Marine API"]};
  await getDb().insert(conditionSnapshots).values({placeId:place.id,observedAt:result.observedAt,temperature:result.temperature,precipitation:result.precipitation,windSpeed:result.windSpeed,waveHeight:result.waveHeight,waterTemperature:result.waterTemperature,source:"open-meteo"});
  return result;
}

export async function getConditionWithFallback(place:MarinePlace):Promise<LiveCondition>{
  try{return await getLiveCondition(place)}catch{
    const wave=place.activityKind==="surf"?.85:place.activityKind==="walk"?.7:.45;
    return {temperature:26,precipitation:0,windSpeed:3.5,waveHeight:wave,waterTemperature:24,crowdEstimate:crowdEstimate(place.baselineCrowd),observedAt:new Date().toISOString(),dataStatus:{weather:"fallback",marine:"fallback",crowd:"estimated"},sources:["Stored baseline conditions"]};
  }
}

export function distanceKm(a:{lat:number;lon:number},b:{lat:number;lon:number}){const rad=(n:number)=>n*Math.PI/180;const dLat=rad(b.lat-a.lat);const dLon=rad(b.lon-a.lon);const h=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLon/2)**2;return 6371*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h));}

export function recommendationScore(place:any,condition:LiveCondition,people:number,distance:number){
  const weather=Math.max(0,100-Math.abs(condition.temperature-25)*4-condition.precipitation*7-Math.max(0,condition.windSpeed-8)*6);
  const kind=place.activityKind; let sea=100;
  if(kind==="surf") sea=Math.max(0,100-Math.abs(condition.waveHeight-1.05)*70-Math.max(0,condition.windSpeed-6)*10);
  else if(kind==="sup"||kind==="kayak") sea=Math.max(0,100-condition.waveHeight*70-Math.max(0,condition.windSpeed-4)*13);
  else if(kind==="swim") sea=Math.max(0,100-Math.abs(condition.waterTemperature-25)*7-condition.waveHeight*45-Math.max(0,condition.windSpeed-5)*12);
  else if(kind==="yacht") sea=Math.max(0,100-Math.abs(condition.windSpeed-4)*7-condition.waveHeight*32);
  else if(kind==="fishing") sea=Math.max(0,100-condition.waveHeight*30-Math.max(0,condition.windSpeed-6)*12);
  else sea=Math.max(0,100-Math.max(0,condition.waveHeight-1)*25-Math.max(0,condition.windSpeed-7)*10);
  const crowd=100-condition.crowdEstimate;const distanceScore=Math.max(20,100-distance*4.3);const group=people>=place.groupMin&&people<=place.groupMax?100:Math.max(20,100*Math.min(people,place.groupMax)/Math.max(people,place.groupMin));
  const total=Math.round(weather*.24+sea*.36+crowd*.16+distanceScore*.14+group*.1);
  return {total,weather:Math.round(weather),sea:Math.round(sea),crowd:Math.round(crowd),distance:Math.round(distanceScore),group:Math.round(group)};
}
