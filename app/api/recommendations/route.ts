import { listActivities, listPlaces } from "../../../db/catalog";
import { distanceKm, getConditionWithFallback, recommendationScore } from "../../../lib/marine";

export async function GET(request:Request){
  try{
    const params=new URL(request.url).searchParams;const category=params.get("category")??"all";const people=Math.max(1,Math.min(10,Number(params.get("people")??2)));const origin={lat:Number(params.get("lat")??35.1532),lon:Number(params.get("lon")??129.1187)};
    const [places,activities]=await Promise.all([listPlaces(),listActivities()]);
    const enriched=await Promise.all(places.map(async place=>{const condition=await getConditionWithFallback(place);const distance=distanceKm(origin,{lat:place.latitude,lon:place.longitude});const primary=activities.find(item=>item.placeId===place.id);return {id:place.id,name:{en:place.nameEn,ko:place.nameKo,ja:place.nameJa,zh:place.nameZh},activity:{en:primary?.titleEn??place.activityKind,ko:primary?.titleKo??place.activityKind,ja:primary?.titleJa??place.activityKind,zh:primary?.titleZh??place.activityKind},kind:place.activityKind,icon:place.icon,categories:JSON.parse(place.categories),lat:place.latitude,lon:place.longitude,distance,water:condition.waterTemperature,wave:condition.waveHeight,wind:condition.windSpeed,temp:condition.temperature,rain:condition.precipitation,crowd:condition.crowdEstimate,group:[place.groupMin,place.groupMax],scores:recommendationScore(place,condition,people,distance),conditionStatus:condition.dataStatus,address:place.addressKo,sourceUrl:place.sourceUrl};}));
    const recommendations=enriched.filter(item=>category==="all"||item.categories.includes(category)).sort((a,b)=>b.scores.total-a.scores.total);
    const hasFallback=enriched.some(item=>item.conditionStatus.weather==="fallback"||item.conditionStatus.marine==="fallback");
    return Response.json({recommendations,places:enriched,meta:{generatedAt:new Date().toISOString(),weatherMarine:hasFallback?"fallback":"live_forecast",crowd:"estimated",database:"D1"}});
  }catch(error){return Response.json({error:error instanceof Error?error.message:"Unable to generate recommendations"},{status:502})}
}
