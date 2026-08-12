import { listPlaces } from "../../../db/catalog";
import {optionalRuntimeSecret} from "../../../lib/adapters/runtime-config";
import {TOUR_API_DOCS,TourApiAdapter,type TourApiLanguage} from "../../../lib/adapters/tour-api";

export async function GET(request:Request){
  try{
    const params=new URL(request.url).searchParams;const provider=params.get("provider")??"auto";const language=(params.get("lang")??"ko") as TourApiLanguage;const serviceKey=optionalRuntimeSecret("TOUR_API_SERVICE_KEY");
    if((provider==="auto"&&serviceKey)||provider==="tour-api"){
      if(!(["ko","en","ja","zh"] as string[]).includes(language))return Response.json({error:"lang must be ko, en, ja, or zh"},{status:400});
      if(!serviceKey)return Response.json({error:"TOUR_API_SERVICE_KEY is not configured",documentationUrl:TOUR_API_DOCS[language]},{status:503});
      const latitude=Number(params.get("lat")??35.1796);const longitude=Number(params.get("lon")??129.0756);const radiusMeters=Math.max(1,Math.min(20000,Number(params.get("radius")??20000)));const limit=Math.max(1,Math.min(100,Number(params.get("limit")??50)));
      const places=await new TourApiAdapter(serviceKey,language).searchNearby({latitude,longitude,radiusMeters,limit});return Response.json({places,meta:{source:"kto-tour-api-4",documentationUrl:TOUR_API_DOCS[language],count:places.length}});
    }
    const rows=await listPlaces();return Response.json({places:rows.map(row=>({...row,categories:JSON.parse(row.categories)})),meta:{source:"curated_d1",count:rows.length}})
  }
  catch(error){return Response.json({error:error instanceof Error?error.message:"Unable to load places"},{status:500})}
}
