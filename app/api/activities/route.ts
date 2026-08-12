import { listActivities } from "../../../db/catalog";

export async function GET(request:Request){
  try{const placeId=new URL(request.url).searchParams.get("placeId");const rows=await listActivities();const filtered=placeId?rows.filter(row=>row.placeId===placeId):rows;return Response.json({activities:filtered,meta:{source:"curated_d1",count:filtered.length,note:"No verified external provider is configured for real-time marine activity inventory or availability."}})}
  catch(error){return Response.json({error:error instanceof Error?error.message:"Unable to load activities"},{status:500})}
}
