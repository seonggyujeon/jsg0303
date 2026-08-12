"use client";

import { useEffect, useMemo, useState } from "react";

type Lang = "en" | "ko" | "ja" | "zh";
type Kind = "all" | "swim" | "surf" | "sup" | "kayak" | "yacht" | "walk";
type Localized = Record<Lang, string>;
type Spot = {
  id:string; name:Localized; activity:Localized; kind:Exclude<Kind,"all">; icon:string;
  lat:number; lon:number; distance:number; water:number; wave:number; wind:number;
  temp:number; rain:number; crowd:number; group:[number,number];
};

const ui = {
  en:{title:"Compare every coast.",accent:"Pick the best one now.",sub:"We rank Busan’s beaches using local weather, sea conditions, estimated crowds, distance and group size.",group:"Group size",goal:"Activity",all:"All",swim:"Swim",surf:"Surf",sup:"SUP",kayak:"Kayak",yacht:"Yacht",walk:"Coastal walk",live:"LIVE COMPARISON",updated:"Updated",refresh:"Refresh data",loading:"Updating…",best:"Best match now",why:"Why it ranks first",condition:"Conditions",weather:"Weather",sea:"Sea",crowd:"Crowd",distance:"Distance",groupFit:"Group fit",water:"Water",wave:"Waves",wind:"Wind",rain:"Rain",people:"people",estimated:"estimated",route:"Directions",details:"Score details",results:"All Busan recommendations",compare:"Ranked from the same conditions",safe:"Good",caution:"Caution",dataLive:"Weather & marine forecast live",dataFallback:"Using backup conditions",crowdNote:"Crowding is an estimate based on location, day and time—not a live headcount.",source:"Marine forecast: Open-Meteo · weather: Open-Meteo",recommend:"Recommended because sea and weather conditions suit this activity, with crowd and travel time also considered.",name:"BUSAN BLUE"},
  ko:{title:"부산 바다를 모두 비교해,",accent:"지금 가장 좋은 곳을 골라드려요.",sub:"해변별 날씨와 수온·파고·바람, 예상 혼잡도, 거리, 인원까지 같은 기준으로 계산해 추천합니다.",group:"함께 가는 인원",goal:"원하는 활동",all:"전체",swim:"수영",surf:"서핑",sup:"SUP",kayak:"카약",yacht:"요트",walk:"해안 산책",live:"실시간 비교 추천",updated:"업데이트",refresh:"데이터 새로고침",loading:"불러오는 중…",best:"지금 가장 추천해요",why:"1순위인 이유",condition:"현장 조건",weather:"날씨",sea:"바다",crowd:"혼잡도",distance:"거리",groupFit:"인원 적합",water:"수온",wave:"파고",wind:"바람",rain:"강수",people:"명",estimated:"예상",route:"길찾기",details:"점수 자세히",results:"부산 전역 추천 결과",compare:"모든 후보를 같은 조건으로 비교했어요",safe:"좋음",caution:"주의",dataLive:"날씨·해양예보 실시간 반영",dataFallback:"기준 데이터로 계산 중",crowdNote:"혼잡도는 위치·요일·시간대 기준 예상치이며, 실제 현장 인원 집계가 아닙니다.",source:"해양예보: Open-Meteo · 날씨: Open-Meteo",recommend:"해당 활동에 맞는 바다와 날씨 조건을 우선 반영하고, 혼잡도와 이동 부담까지 함께 계산했어요.",name:"BUSAN BLUE"},
  ja:{title:"釜山の海をまとめて比べて、",accent:"今いちばん楽しめる場所へ。",sub:"ビーチごとの天気、水温、波、風、予想混雑度、距離、人数を同じ基準で採点します。",group:"ご利用人数",goal:"楽しみたいこと",all:"すべて",swim:"海水浴",surf:"サーフィン",sup:"SUP",kayak:"カヤック",yacht:"ヨット",walk:"海辺の散策",live:"リアルタイム比較",updated:"更新",refresh:"データを更新",loading:"更新中…",best:"今いちばんのおすすめ",why:"1位の理由",condition:"現地の状況",weather:"天気",sea:"海況",crowd:"混雑度",distance:"距離",groupFit:"人数",water:"水温",wave:"波の高さ",wind:"風速",rain:"降水",people:"人",estimated:"予想",route:"ルートを見る",details:"採点の内訳",results:"釜山全域のおすすめ",compare:"すべて同じ基準で比較しています",safe:"良好",caution:"注意",dataLive:"天気・海洋予報を反映中",dataFallback:"基準データで計算中",crowdNote:"混雑度は場所・曜日・時間帯から算出した予想値で、実際の人数ではありません。",source:"海洋予報：Open-Meteo · 天気：Open-Meteo",recommend:"アクティビティに合う海況と天気を優先し、混雑度や移動の負担も含めて評価しています。",name:"BUSAN BLUE"},
  zh:{title:"对比釜山各处海岸，",accent:"找到此刻最值得去的地方。",sub:"采用统一标准，综合比较天气、水温、浪高、风速、预计拥挤度、距离及同行人数。",group:"同行人数",goal:"想体验的活动",all:"全部",swim:"海边游泳",surf:"冲浪",sup:"桨板",kayak:"皮划艇",yacht:"游艇",walk:"海岸漫步",live:"实时对比推荐",updated:"更新时间",refresh:"刷新数据",loading:"更新中…",best:"此刻首选推荐",why:"排名第一的原因",condition:"现场条件",weather:"天气",sea:"海况",crowd:"拥挤度",distance:"距离",groupFit:"人数匹配",water:"水温",wave:"浪高",wind:"风速",rain:"降水",people:"人",estimated:"预计",route:"查看路线",details:"查看评分详情",results:"釜山全域推荐结果",compare:"所有地点均按同一套标准比较",safe:"良好",caution:"注意",dataLive:"已接入天气与海洋预报",dataFallback:"正在使用备用数据",crowdNote:"拥挤度根据地点、星期和时段估算，并非现场实时人数。",source:"海洋预报：Open-Meteo · 天气：Open-Meteo",recommend:"优先评估是否适合该项活动的海况与天气，同时考虑拥挤程度和出行距离。",name:"BUSAN BLUE"}
} as const;

const L=(en:string,ko:string,ja:string,zh:string):Localized=>({en,ko,ja,zh});
const base:Spot[]=[
  {id:"gwangalli",name:L("Gwangalli Beach","광안리해수욕장","広安里（クァンアンリ）海水浴場","广安里海水浴场"),activity:L("Sunset SUP","노을 SUP","夕暮れのSUP","夕阳桨板"),kind:"sup",icon:"🏄",lat:35.1532,lon:129.1187,distance:1.2,water:23.8,wave:.35,wind:2.4,temp:26,rain:0,crowd:38,group:[1,6]},
  {id:"songjeong",name:L("Songjeong Beach","송정해수욕장","松亭（ソンジョン）海水浴場","松亭海水浴场"),activity:L("Beginner surfing","초보 서핑","初心者向けサーフィン","初学者冲浪"),kind:"surf",icon:"🏄‍♀️",lat:35.1786,lon:129.1997,distance:7.6,water:24.1,wave:.85,wind:3.8,temp:27,rain:0,crowd:44,group:[1,4]},
  {id:"haeundae",name:L("Haeundae Beach","해운대해수욕장","海雲台（ヘウンデ）海水浴場","海云台海水浴场"),activity:L("Sea swimming","해수욕","海水浴","海边游泳"),kind:"swim",icon:"🏊",lat:35.1587,lon:129.1604,distance:4.9,water:24,wave:.48,wind:3.2,temp:27,rain:0,crowd:78,group:[1,8]},
  {id:"suyeong",name:L("Suyeong Bay","수영만요트경기장","水営湾ヨット競技場","水营湾游艇码头"),activity:L("Yacht cruise","요트 투어","ヨットクルーズ","游艇观光"),kind:"yacht",icon:"⛵",lat:35.1589,lon:129.1354,distance:2.8,water:23.7,wave:.42,wind:4.1,temp:26,rain:0,crowd:52,group:[4,10]},
  {id:"dadaepo",name:L("Dadaepo Beach","다대포해수욕장","多大浦（タデポ）海水浴場","多大浦海水浴场"),activity:L("Sunset kayaking","노을 카약","夕暮れのカヤック","夕阳皮划艇"),kind:"kayak",icon:"🛶",lat:35.0467,lon:128.9655,distance:15.8,water:24.4,wave:.28,wind:2.9,temp:27,rain:0,crowd:29,group:[2,6]},
  {id:"songdo",name:L("Songdo Beach","송도해수욕장","松島（ソンド）海水浴場","松岛海水浴场"),activity:L("Coastal kayak","해안 카약","シーカヤック","海岸皮划艇"),kind:"kayak",icon:"🚣",lat:35.0759,lon:129.0168,distance:10.6,water:23.9,wave:.32,wind:3,temp:26,rain:0,crowd:35,group:[2,8]},
  {id:"ilgwang",name:L("Ilgwang Beach","일광해수욕장","日光（イルグァン）海水浴場","日光海水浴场"),activity:L("Quiet swimming","한적한 해수욕","のんびり海水浴","悠闲海泳"),kind:"swim",icon:"🤿",lat:35.2593,lon:129.2331,distance:19.4,water:23.6,wave:.4,wind:3.5,temp:26,rain:0,crowd:21,group:[1,8]},
  {id:"oryukdo",name:L("Oryukdo Skywalk","오륙도 해맞이공원","五六島（オリュクト）スカイウォーク","五六岛天空步道"),activity:L("Coastal walk","해안 산책","海辺の散策","海岸漫步"),kind:"walk",icon:"🥾",lat:35.1008,lon:129.1238,distance:8.7,water:23.4,wave:.72,wind:4.6,temp:25,rain:0,crowd:33,group:[1,10]},
  {id:"taejongdae",name:L("Taejongdae Coast","태종대 해안","太宗台（テジョンデ）海岸","太宗台海岸"),activity:L("Cliffside walk","절벽 해안 산책","海岸トレッキング","海岸徒步"),kind:"walk",icon:"🌊",lat:35.0526,lon:129.0872,distance:14.2,water:23.2,wave:.9,wind:5.2,temp:25,rain:0,crowd:27,group:[1,10]},
  {id:"gijang",name:L("Gongsu Fishing Village","기장 공수어촌체험마을","機張（キジャン）公須漁村","机张公须渔村"),activity:L("Village sea experience","어촌 해양체험","漁村体験","渔村体验"),kind:"walk",icon:"🎣",lat:35.1849,lon:129.2079,distance:10.3,water:23.5,wave:.58,wind:3.9,temp:26,rain:0,crowd:18,group:[2,10]},
];

function seaScore(s:Spot){
  if(s.kind==="surf") return Math.max(0,100-Math.abs(s.wave-1.05)*70-Math.max(0,s.wind-6)*10);
  if(s.kind==="sup"||s.kind==="kayak") return Math.max(0,100-s.wave*70-Math.max(0,s.wind-4)*13);
  if(s.kind==="swim") return Math.max(0,100-Math.abs(s.water-25)*7-s.wave*45-Math.max(0,s.wind-5)*12);
  if(s.kind==="yacht") return Math.max(0,100-Math.abs(s.wind-4)*7-s.wave*32);
  return Math.max(0,100-Math.max(0,s.wave-1)*25-Math.max(0,s.wind-7)*10);
}
function score(s:Spot,people:number,kind:Kind){
  const weather=Math.max(0,100-Math.abs(s.temp-25)*4-s.rain*7-Math.max(0,s.wind-8)*6);
  const sea=seaScore(s); const crowd=100-s.crowd; const distance=Math.max(20,100-s.distance*4.3);
  const group=people>=s.group[0]&&people<=s.group[1]?100:Math.max(20,100*Math.min(people,s.group[1])/Math.max(people,s.group[0]));
  const preference=kind==="all"||kind===s.kind?100:48;
  let total=Math.round(weather*.2+sea*.3+crowd*.15+distance*.12+group*.08+preference*.15);
  const unsafe=(s.kind==="swim"&&s.wave>1.2)||(s.kind==="sup"&&s.wave>.9)||(s.kind==="kayak"&&s.wave>1.1)||s.wind>10||s.rain>8;
  if(unsafe) total=Math.min(total,54);
  return {total,weather:Math.round(weather),sea:Math.round(sea),crowd:Math.round(crowd),distance:Math.round(distance),group:Math.round(group),unsafe};
}

async function liveSpot(s:Spot):Promise<Spot>{
  const weatherUrl=`https://api.open-meteo.com/v1/forecast?latitude=${s.lat}&longitude=${s.lon}&current=temperature_2m,precipitation,wind_speed_10m&wind_speed_unit=ms&timezone=Asia%2FSeoul`;
  const marineUrl=`https://marine-api.open-meteo.com/v1/marine?latitude=${s.lat}&longitude=${s.lon}&hourly=wave_height,sea_surface_temperature&forecast_days=1&timezone=Asia%2FSeoul`;
  const [w,m]=await Promise.all([fetch(weatherUrl),fetch(marineUrl)]); if(!w.ok||!m.ok) throw new Error("feed");
  const wd=await w.json(); const md=await m.json(); const now=new Date(); const hour=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}T${String(now.getHours()).padStart(2,"0")}:00`;
  const i=Math.max(0,md.hourly.time.indexOf(hour));
  return {...s,temp:wd.current.temperature_2m,rain:wd.current.precipitation,wind:wd.current.wind_speed_10m,wave:md.hourly.wave_height[i]??s.wave,water:md.hourly.sea_surface_temperature[i]??s.water};
}

export default function Home(){
  const [lang,setLang]=useState<Lang>("en"); const [people,setPeople]=useState(2); const [kind,setKind]=useState<Kind>("all"); const [spots,setSpots]=useState(base); const [loading,setLoading]=useState(false); const [live,setLive]=useState(false); const [updated,setUpdated]=useState(""); const [open,setOpen]=useState<string|null>(null); const t=ui[lang];
  const refresh=async()=>{setLoading(true);try{const next=await Promise.all(base.map(liveSpot));setSpots(next);setLive(true)}catch{setSpots(base);setLive(false)}finally{setUpdated(new Intl.DateTimeFormat(lang,{hour:"2-digit",minute:"2-digit"}).format(new Date()));setLoading(false)}};
  useEffect(()=>{document.documentElement.lang=lang==="zh"?"zh-CN":lang;refresh()},[]);
  const ranked=useMemo(()=>spots.map(s=>({...s,scores:score(s,people,kind)})).sort((a,b)=>b.scores.total-a.scores.total),[spots,people,kind]); const best=ranked[0];
  const kinds:Kind[]=["all","swim","surf","sup","kayak","yacht","walk"];
  return <main>
    <header className="nav"><a className="logo" href="#top"><span>〰</span>{t.name}</a><div className="language">{(["en","ko","ja","zh"] as Lang[]).map(x=><button className={lang===x?"on":""} onClick={()=>setLang(x)} key={x}>{x==="en"?"EN":x==="ko"?"한국어":x==="ja"?"日本語":"中文"}</button>)}</div></header>
    <section className="compare-hero" id="top"><div><p className="overline">BUSAN · 10 COASTAL SPOTS</p><h1>{t.title}<br/><em>{t.accent}</em></h1><p>{t.sub}</p></div><div className="filters"><div className="people-filter"><span>{t.group}</span><div><button onClick={()=>setPeople(Math.max(1,people-1))}>−</button><b>{people}</b><small>{t.people}</small><button onClick={()=>setPeople(Math.min(10,people+1))}>＋</button></div></div><div className="activity-filter"><span>{t.goal}</span><div>{kinds.map(k=><button className={kind===k?"active":""} onClick={()=>setKind(k)} key={k}>{t[k]}</button>)}</div></div></div></section>
    <section className="ranking"><div className="rank-top"><div><span>{t.live}</span><h2>{t.best}</h2><p className={live?"feed live":"feed"}>● {live?t.dataLive:t.dataFallback} · {t.updated} {updated||"--:--"}</p></div><button onClick={refresh} disabled={loading}>↻ {loading?t.loading:t.refresh}</button></div>
      <article className="winner"><div className="winner-visual"><span>{best.icon}</span><b>#1 · {best.activity[lang]}</b></div><div className="winner-info"><div className="winner-title"><div><small>{best.distance.toFixed(1)} km</small><h3>{best.name[lang]}</h3></div><strong>{best.scores.total}<small>/100</small></strong></div><p>{t.recommend}</p><div className="conditions"><span>🌡 {best.temp.toFixed(1)}°C</span><span>🌊 {best.wave.toFixed(1)}m</span><span>💨 {best.wind.toFixed(1)}m/s</span><span>👥 {best.crowd}% {t.estimated}</span></div><div className="bars">{([["weather",best.scores.weather],["sea",best.scores.sea],["crowd",best.scores.crowd],["distance",best.scores.distance],["groupFit",best.scores.group]] as [keyof typeof t,number][]).map(([label,value])=><div key={label}><span>{t[label]} <b>{value}</b></span><i><em style={{width:`${value}%`}}/></i></div>)}</div><div className="win-actions"><button onClick={()=>setOpen(open===best.id?null:best.id)}>{t.details} →</button><a href={`https://www.google.com/maps/search/?api=1&query=${best.lat},${best.lon}`} target="_blank" rel="noreferrer">{t.route} ↗</a></div>{open===best.id&&<div className="score-note">20% {t.weather} + 30% {t.sea} + 15% {t.crowd} + 12% {t.distance} + 8% {t.groupFit} + 15% {t.goal}</div>}</div></article>
      <div className="list-head"><div><span>{t.results}</span><h2>{t.compare}</h2></div><small>{ranked.length} SPOTS</small></div><div className="result-list">{ranked.map((s,i)=><article key={s.id} className={s.scores.unsafe?"unsafe":""}><div className="place-rank">{String(i+1).padStart(2,"0")}</div><div className="place-icon">{s.icon}</div><div className="place-main"><small>{s.activity[lang]} · {s.distance.toFixed(1)} km</small><h3>{s.name[lang]}</h3><div><span>{t.water} {s.water.toFixed(1)}°C</span><span>{t.wave} {s.wave.toFixed(1)}m</span><span>{t.wind} {s.wind.toFixed(1)}m/s</span><span>{t.crowd} {s.crowd}%</span></div></div><div className="place-score"><b>{s.scores.total}</b><small>{s.scores.unsafe?t.caution:t.safe}</small></div></article>)}</div>
    </section>
    <section className="method"><h2>{t.why}</h2><div><span><b>30%</b>{t.sea}</span><span><b>20%</b>{t.weather}</span><span><b>15%</b>{t.crowd}</span><span><b>15%</b>{t.goal}</span><span><b>12%</b>{t.distance}</span><span><b>8%</b>{t.groupFit}</span></div><p>ⓘ {t.crowdNote}</p><small>{t.source}</small></section>
    <footer><a className="logo" href="#top"><span>〰</span>{t.name}</a><p>Busan marine activity comparison for international travelers.</p></footer>
  </main>
}
