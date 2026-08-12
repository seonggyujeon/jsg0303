import type {ExternalPlace,PlaceSearchAdapter} from "./contracts";

export type TourApiLanguage="ko"|"en"|"ja"|"zh";
export const TOUR_API_DOCS:Record<TourApiLanguage,string>={ko:"https://www.data.go.kr/data/15101578/openapi.do",en:"https://www.data.go.kr/data/15101753/openapi.do",ja:"https://www.data.go.kr/data/15101760/openapi.do",zh:"https://www.data.go.kr/data/15101764/openapi.do"};
const SERVICE:Record<TourApiLanguage,string>={ko:"KorService2",en:"EngService2",ja:"JpnService2",zh:"ChsService2"};

type TourItem={contentid?:string;title?:string;addr1?:string;mapx?:string;mapy?:string;contenttypeid?:string;firstimage?:string;modifiedtime?:string};
type TourResponse={response?:{header?:{resultCode?:string;resultMsg?:string};body?:{items?:{item?:TourItem|TourItem[]}|"";totalCount?:number}}};

function itemsFrom(payload:unknown):TourItem[]{
  if(!payload||typeof payload!=="object")throw new Error("TourAPI response is not an object");const response=(payload as TourResponse).response;if(!response)throw new Error("TourAPI response.response is missing");
  if(response.header?.resultCode!=="0000")throw new Error(`TourAPI ${response.header?.resultCode??"UNKNOWN"}: ${response.header?.resultMsg??"request failed"}`);
  const item=response.body?.items&&response.body.items!==""?response.body.items.item:undefined;return item?Array.isArray(item)?item:[item]:[];
}

export class TourApiAdapter implements PlaceSearchAdapter{
  readonly id="kto-tour-api-4";
  constructor(private readonly serviceKey:string,private readonly language:TourApiLanguage="ko"){if(!serviceKey.trim())throw new Error("TOUR_API_SERVICE_KEY is required")}
  async searchNearby({latitude,longitude,radiusMeters,limit}:{latitude:number;longitude:number;radiusMeters:number;limit:number}):Promise<ExternalPlace[]>{
    const url=new URL(`https://apis.data.go.kr/B551011/${SERVICE[this.language]}/locationBasedList2`);
    url.search=new URLSearchParams({serviceKey:this.serviceKey,numOfRows:String(limit),pageNo:"1",MobileOS:"ETC",MobileApp:"BusanBlue",_type:"json",arrange:"E",mapX:String(longitude),mapY:String(latitude),radius:String(radiusMeters)}).toString();
    const response=await fetch(url);if(!response.ok)throw new Error(`TourAPI returned HTTP ${response.status}`);const rows=itemsFrom(await response.json());
    return rows.flatMap((item):ExternalPlace[]=>{const latitude=Number(item.mapy);const longitude=Number(item.mapx);if(!item.contentid||!item.title||!Number.isFinite(latitude)||!Number.isFinite(longitude))return [];return [{providerId:item.contentid,title:item.title,address:item.addr1??"",latitude,longitude,contentTypeId:item.contenttypeid??"",imageUrl:item.firstimage||null,modifiedTime:item.modifiedtime||null}]});
  }
}
