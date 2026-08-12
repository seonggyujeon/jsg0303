import { listActivities } from "../../../db/catalog";

export async function GET(request:Request){
  try{const placeId=new URL(request.url).searchParams.get("placeId");const rows=await listActivities();const filtered=placeId?rows.filter(row=>row.placeId===placeId):rows;return Response.json({activities:filtered,meta:{source:"D1",count:filtered.length}})}
  catch(error){return Response.json({error:error instanceof Error?error.message:"Unable to load activities"},{status:500})}
}
