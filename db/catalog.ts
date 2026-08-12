import { env } from "cloudflare:workers";
import { asc, eq } from "drizzle-orm";
import { getDb } from "./index";
import { activities, places } from "./schema";

type PlaceSeed={id:string;names:[string,string,string,string];lat:number;lon:number;icon:string;kind:string;categories:string[];crowd:number;group:[number,number];address:string;source:string};
type ActivitySeed={id:string;placeId:string;titles:[string,string,string,string];descriptions:[string,string,string,string];reservation:boolean;minAge:number|null;safety:string};

const placeSeeds:PlaceSeed[]=[
  {id:"gwangalli",names:["Gwangalli Beach","광안리해수욕장","広安里海水浴場","广安里海水浴场"],lat:35.1532,lon:129.1187,icon:"🏄",kind:"sup",categories:["activity","relax"],crowd:38,group:[1,6],address:"부산 수영구 광안해변로 219",source:"https://www.visitbusan.net"},
  {id:"songjeong",names:["Songjeong Beach","송정해수욕장","松亭海水浴場","松亭海水浴场"],lat:35.1786,lon:129.1997,icon:"🏄‍♀️",kind:"surf",categories:["activity"],crowd:44,group:[1,4],address:"부산 해운대구 송정해변로 62",source:"https://www.visitbusan.net"},
  {id:"haeundae",names:["Haeundae Beach","해운대해수욕장","海雲台海水浴場","海云台海水浴场"],lat:35.1587,lon:129.1604,icon:"🏊",kind:"swim",categories:["activity","relax","kids"],crowd:78,group:[1,8],address:"부산 해운대구 해운대해변로 264",source:"https://www.visitbusan.net"},
  {id:"suyeong",names:["Suyeong Bay Yacht Stadium","수영만요트경기장","水営湾ヨット競技場","水营湾游艇码头"],lat:35.1589,lon:129.1354,icon:"⛵",kind:"yacht",categories:["activity","relax","kids"],crowd:52,group:[4,10],address:"부산 해운대구 해운대해변로 84",source:"https://www.visitbusan.net"},
  {id:"dadaepo",names:["Dadaepo Beach","다대포해수욕장","多大浦海水浴場","多大浦海水浴场"],lat:35.0467,lon:128.9655,icon:"🛶",kind:"kayak",categories:["activity","relax","kids"],crowd:29,group:[2,6],address:"부산 사하구 몰운대1길 14",source:"https://www.visitbusan.net"},
  {id:"songdo",names:["Songdo Beach","송도해수욕장","松島海水浴場","松岛海水浴场"],lat:35.0759,lon:129.0168,icon:"🚣",kind:"kayak",categories:["activity","kids"],crowd:35,group:[2,8],address:"부산 서구 송도해변로 100",source:"https://www.visitbusan.net"},
  {id:"ilgwang",names:["Ilgwang Beach","일광해수욕장","日光海水浴場","日光海水浴场"],lat:35.2593,lon:129.2331,icon:"🤿",kind:"swim",categories:["relax","kids"],crowd:21,group:[1,8],address:"부산 기장군 일광읍 삼성3길 17",source:"https://www.visitbusan.net"},
  {id:"oryukdo",names:["Oryukdo Skywalk","오륙도 해맞이공원","五六島スカイウォーク","五六岛天空步道"],lat:35.1008,lon:129.1238,icon:"🥾",kind:"walk",categories:["relax","kids"],crowd:33,group:[1,10],address:"부산 남구 오륙도로 137",source:"https://www.visitbusan.net"},
  {id:"taejongdae",names:["Taejongdae Coast","태종대 해안","太宗台海岸","太宗台海岸"],lat:35.0526,lon:129.0872,icon:"🌊",kind:"walk",categories:["relax","kids"],crowd:27,group:[1,10],address:"부산 영도구 전망로 24",source:"https://www.visitbusan.net"},
  {id:"gijang",names:["Gongsu Fishing Village","기장 공수어촌체험마을","機張公須漁村","机张公须渔村"],lat:35.1849,lon:129.2079,icon:"🎣",kind:"walk",categories:["kids"],crowd:18,group:[2,10],address:"부산 기장군 기장읍 공수1길 18",source:"https://cms.seantour.com/BS003/index.do"},
  {id:"amnam",names:["Amnam Park Breakwater","암남공원 방파제","岩南公園防波堤","岩南公园防波堤"],lat:35.0617,lon:129.018,icon:"🎣",kind:"fishing",categories:["fishing","relax"],crowd:31,group:[1,4],address:"부산 서구 암남동 620-4",source:"https://www.visitbusan.net/kr/index.do?menuCd=DOM_000000203012001000&uc_seq=790"},
];

const activitySeeds:ActivitySeed[]=[
  {id:"gwangalli-sup",placeId:"gwangalli",titles:["Intro SUP lesson","SUP 입문 강습","初心者SUP","桨板入门课"],descriptions:["Learn paddling and safe falling with an instructor.","강사와 패들링과 안전한 입수법을 배워요.","インストラクターと基本を学びます。","跟随教练学习基础技巧。"],reservation:true,minAge:8,safety:"구명조끼 착용 및 운영 구역 확인"},
  {id:"songjeong-surf",placeId:"songjeong",titles:["Beginner surf lesson","초보 서핑 강습","初心者サーフィン","初学者冲浪课"],descriptions:["Practice on land, then enter with an instructor.","지상 교육 후 강사와 함께 입수해요.","陸上練習後に海へ入ります。","岸上练习后由教练带领下水。"],reservation:true,minAge:10,safety:"초보자는 지정 서핑 구역에서 강사 동반"},
  {id:"haeundae-swim",placeId:"haeundae",titles:["Sea swimming","해수욕","海水浴","海边游泳"],descriptions:["Use the buoyed, lifeguarded zone during beach season.","개장 기간 안전요원이 있는 지정 구역에서 수영해요.","監視区域内で泳ぎます。","在救生员管理区内游泳。"],reservation:false,minAge:null,safety:"개장 기간과 입수 통제 여부 확인"},
  {id:"suyeong-yacht",placeId:"suyeong",titles:["Yacht cruise","요트 투어","ヨットクルーズ","游艇巡航"],descriptions:["Reserve a day, sunset or night departure.","주간·선셋·야간 출항을 예약해요.","出航時間を予約します。","预订日间、日落或夜间航次。"],reservation:true,minAge:null,safety:"바람·파도와 항만 출항 통제 확인"},
  {id:"dadaepo-kayak",placeId:"dadaepo",titles:["Guided sea kayak","가이드 바다 카약","ガイド付きカヤック","教练带领海上皮划艇"],descriptions:["Join a seasonal guided nearshore program.","계절 운영 기간 가이드와 연안 체험을 해요.","季節プログラムに参加します。","参加季节性近岸项目。"],reservation:true,minAge:10,safety:"조수간만과 운영 프로그램 확인"},
  {id:"songdo-kayak",placeId:"songdo",titles:["Coastal kayak","해안 카약","シーカヤック","海岸皮划艇"],descriptions:["Paddle the sheltered coast with safety gear.","안전 장비를 착용하고 잔잔한 연안을 이동해요.","安全装備で沿岸を進みます。","穿戴安全装备沿近岸划行。"],reservation:true,minAge:10,safety:"해수욕 구역과 레저 운항 구역 구분"},
  {id:"ilgwang-family",placeId:"ilgwang",titles:["Family beach play","가족 해변 놀이","家族で砂遊び","亲子沙滩活动"],descriptions:["Enjoy a gentler sandy shore with a guardian.","완만한 모래 해변에서 보호자와 함께 놀아요.","保護者と砂浜で遊びます。","在家长看护下进行沙滩活动。"],reservation:false,minAge:null,safety:"안전요원 운영 기간과 지정 구역 확인"},
  {id:"oryukdo-walk",placeId:"oryukdo",titles:["Coastal trail","해파랑길 걷기","海岸トレイル","海岸徒步"],descriptions:["Walk marked trails with open sea views.","표시된 산책로에서 바다를 보며 걸어요.","案内された道を歩きます。","沿标识步道观海。"],reservation:false,minAge:null,safety:"강풍 시 스카이워크 통제 여부 확인"},
  {id:"taejongdae-walk",placeId:"taejongdae",titles:["Cliffside trail","절벽 해안 산책","断崖沿いの散策","悬崖海岸徒步"],descriptions:["Follow park trails to coastal viewpoints.","공원 산책로를 따라 해안 전망대로 가요.","遊歩道から展望台へ向かいます。","沿园区步道前往海岸观景台。"],reservation:false,minAge:null,safety:"암석 해안 접근 통제와 절벽 구간 주의"},
  {id:"gijang-ecology",placeId:"gijang",titles:["Intertidal ecology","조간대 생태학습","磯の生態観察","潮间带生态观察"],descriptions:["Observe small marine life at low tide.","간조 때 작은 해양생물을 관찰해요.","干潮時に生き物を観察します。","退潮时观察小型海洋生物。"],reservation:true,minAge:6,safety:"마을에 물때와 운영 프로그램 전화 확인"},
  {id:"amnam-fishing",placeId:"amnam",titles:["Breakwater fishing","방파제 생활낚시","堤防釣り","防波堤垂钓"],descriptions:["Fish only from an open breakwater area.","출입이 허용된 방파제 구역에서 낚시해요.","開放された防波堤で釣ります。","仅在开放防波堤区域垂钓。"],reservation:false,minAge:12,safety:"구명조끼·미끄럼 방지 신발 착용, 악천후 출입 금지"},
];

let initialized=false;
export async function ensureCatalog(){
  if(initialized) return;
  const d1=env.DB;
  await d1.batch([
    d1.prepare("CREATE TABLE IF NOT EXISTS places (id TEXT PRIMARY KEY, name_en TEXT NOT NULL, name_ko TEXT NOT NULL, name_ja TEXT NOT NULL, name_zh TEXT NOT NULL, latitude REAL NOT NULL, longitude REAL NOT NULL, icon TEXT NOT NULL, activity_kind TEXT NOT NULL, categories TEXT NOT NULL, baseline_crowd INTEGER NOT NULL, group_min INTEGER NOT NULL, group_max INTEGER NOT NULL, address_ko TEXT NOT NULL, source_url TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1)"),
    d1.prepare("CREATE TABLE IF NOT EXISTS activities (id TEXT PRIMARY KEY, place_id TEXT NOT NULL REFERENCES places(id), title_en TEXT NOT NULL, title_ko TEXT NOT NULL, title_ja TEXT NOT NULL, title_zh TEXT NOT NULL, description_en TEXT NOT NULL, description_ko TEXT NOT NULL, description_ja TEXT NOT NULL, description_zh TEXT NOT NULL, requires_reservation INTEGER NOT NULL DEFAULT 0, min_age INTEGER, safety_note_ko TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1)"),
    d1.prepare("CREATE TABLE IF NOT EXISTS condition_snapshots (id INTEGER PRIMARY KEY AUTOINCREMENT, place_id TEXT NOT NULL REFERENCES places(id), observed_at TEXT NOT NULL, temperature REAL NOT NULL, precipitation REAL NOT NULL, wind_speed REAL NOT NULL, wave_height REAL NOT NULL, water_temperature REAL NOT NULL, source TEXT NOT NULL)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS idx_places_active_kind ON places(active, activity_kind)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS idx_activities_place_active ON activities(place_id, active)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS idx_snapshots_place_time ON condition_snapshots(place_id, observed_at)"),
  ]);
  await d1.batch(placeSeeds.map(p=>d1.prepare("INSERT OR IGNORE INTO places (id,name_en,name_ko,name_ja,name_zh,latitude,longitude,icon,activity_kind,categories,baseline_crowd,group_min,group_max,address_ko,source_url,active) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1)").bind(p.id,...p.names,p.lat,p.lon,p.icon,p.kind,JSON.stringify(p.categories),p.crowd,p.group[0],p.group[1],p.address,p.source)));
  await d1.batch(placeSeeds.map(p=>d1.prepare("UPDATE places SET activity_kind = ?, categories = ? WHERE id = ?").bind(p.kind,JSON.stringify(p.categories),p.id)));
  await d1.batch(activitySeeds.map(a=>d1.prepare("INSERT OR IGNORE INTO activities (id,place_id,title_en,title_ko,title_ja,title_zh,description_en,description_ko,description_ja,description_zh,requires_reservation,min_age,safety_note_ko,active) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,1)").bind(a.id,a.placeId,...a.titles,...a.descriptions,a.reservation?1:0,a.minAge,a.safety)));
  await d1.prepare("PRAGMA optimize").run();
  initialized=true;
}

export async function listPlaces(){await ensureCatalog();return getDb().select().from(places).where(eq(places.active,true)).orderBy(asc(places.nameEn));}
export async function listActivities(){await ensureCatalog();return getDb().select().from(activities).where(eq(activities.active,true)).orderBy(asc(activities.placeId));}
