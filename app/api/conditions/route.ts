import { listPlaces } from "../../../db/catalog";
import { getConditionWithFallback } from "../../../lib/marine";

export async function GET(request:Request){
  try{const placeId=new URL(request.url).searchParams.get("placeId");if(!placeId)return Response.json({error:"placeId is required"},{status:400});const place=(await listPlaces()).find(row=>row.id===placeId);if(!place)return Response.json({error:"place not found"},{status:404});const condition=await getConditionWithFallback(place);return Response.json({placeId,condition})}
  catch(error){return Response.json({error:error instanceof Error?error.message:"Unable to load live conditions"},{status:502})}
}
