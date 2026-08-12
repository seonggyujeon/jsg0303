import { listPlaces } from "../../../db/catalog";

export async function GET(){
  try{const rows=await listPlaces();return Response.json({places:rows.map(row=>({...row,categories:JSON.parse(row.categories)})),meta:{source:"D1",count:rows.length}})}
  catch(error){return Response.json({error:error instanceof Error?error.message:"Unable to load places"},{status:500})}
}
