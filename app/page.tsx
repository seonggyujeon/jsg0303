"use client";

import { useEffect, useMemo, useState } from "react";

type Lang = "en" | "ko" | "ja" | "zh";
type Activity = "swim" | "surf" | "family" | "photo";

const copy = {
  en: { lang:"English", date:"AUG 12 · BUSAN", hello:"Your best beach day in Busan,", accent:"planned in seconds.", sub:"Live sea conditions, local activities and practical travel help — made for international visitors.", location:"Near Gwangalli", locate:"Use my location", group:"Your group", groupHelp:"Total people joining today", mood:"What are you here for?", swim:"Swimming", surf:"Surfing", family:"Family", photo:"Photo spots", best:"BEST FOR YOU NOW", fit:"match", why:"Why this works", people:"people", ideal:"Ideal group", max:"Max", conditions:"LIVE SEA CONDITIONS", water:"Water", wave:"Waves", wind:"Wind", crowd:"Crowd", calm:"Comfortable", low:"Low", light:"Light", relaxed:"Relaxed", more:"Other beaches for you", route:"Directions", details:"View details", quick:"TRAVEL WITH CONFIDENCE", help:"Essential help in Busan", translate:"Show this phrase", call:"Emergency 119", tourist:"Tourist helpline 1330", transport:"Transit guide", phrase:"Please take me to this beach.", phraseHint:"Korean phrase card", emergencyHelp:"Police 112 · Fire & rescue 119", languageHelp:"English · Japanese · Chinese", transitHelp:"Subway · bus · taxi", sample:"Demo data", sampleText:"Sea conditions shown here are sample data for product testing.", footer:"Your friendly guide to Busan’s coast.", reason:"Gentle waves and light wind make this the easiest, most scenic choice for your group.", prep:"Bring sunscreen, a towel and water. Life jackets are available at the activity desk.", open:"What to bring", close:"Close tips", current:"Current location", map:"Explore map", name:"BUSAN BLUE" },
  ko: { lang:"한국어", date:"8월 12일 · 부산", hello:"부산에서 즐길 오늘의 바다,", accent:"지금 딱 맞는 곳을 찾아드릴게요.", sub:"실시간 바다 상황부터 해양 액티비티, 교통·안전 정보까지 해외 여행객에게 꼭 필요한 내용만 모았어요.", location:"광안리 주변", locate:"현재 위치 사용", group:"함께 가는 인원", groupHelp:"어른과 아이를 포함해 입력해 주세요", mood:"오늘 바다에서 무엇을 하고 싶나요?", swim:"수영", surf:"서핑", family:"가족과 함께", photo:"사진 명소", best:"지금 가장 추천해요", fit:"추천", why:"추천 포인트", people:"명", ideal:"추천 인원", max:"최대", conditions:"현재 바다 상황", water:"수온", wave:"파도", wind:"바람", crowd:"혼잡도", calm:"놀기 좋아요", low:"잔잔해요", light:"약해요", relaxed:"여유로워요", more:"이런 곳도 좋아요", route:"길찾기", details:"자세히 보기", quick:"낯선 부산에서도 걱정 없이", help:"여행 중 바로 쓰는 도움 정보", translate:"현지인에게 보여주기", call:"긴급 신고 119", tourist:"관광통역안내 1330", transport:"대중교통 안내", phrase:"이 해변으로 가 주세요.", phraseHint:"한국어 문장 카드", emergencyHelp:"경찰 112 · 소방·구급 119", languageHelp:"영어 · 일본어 · 중국어", transitHelp:"지하철 · 버스 · 택시", sample:"체험용 데이터", sampleText:"현재 바다 정보는 기능 확인을 위한 예시이며 실시간 관측값이 아닙니다.", footer:"해외 여행객을 위한 친절한 부산 바다 안내.", reason:"파도가 잔잔하고 바람이 약해, 처음 도전하는 분도 일행과 편안하게 즐길 수 있어요.", prep:"선크림과 수건, 마실 물을 챙겨 주세요. 구명조끼는 현장 운영 부스에서 빌릴 수 있어요.", open:"준비물 확인", close:"준비물 닫기", current:"현재 위치 확인", map:"지도에서 보기", name:"BUSAN BLUE" },
  ja: { lang:"日本語", date:"8月12日 · 釜山", hello:"今日の釜山、海で過ごすなら", accent:"今いちばん楽しめる場所へ。", sub:"海のコンディションからアクティビティ、交通・安全情報まで、海外からの旅行者に役立つ情報をひとつにまとめました。", location:"広安里エリア", locate:"現在地を使う", group:"ご利用人数", groupHelp:"大人・お子さまを含む合計人数", mood:"海で何を楽しみたいですか？", swim:"海水浴", surf:"サーフィン", family:"家族で遊ぶ", photo:"絶景・写真", best:"今いちばんのおすすめ", fit:"おすすめ度", why:"おすすめポイント", people:"人", ideal:"おすすめ人数", max:"最大", conditions:"現在の海のコンディション", water:"水温", wave:"波の高さ", wind:"風速", crowd:"混雑状況", calm:"快適です", low:"穏やか", light:"弱め", relaxed:"空いています", more:"こちらもおすすめ", route:"ルートを見る", details:"詳しく見る", quick:"初めての釜山でも安心", help:"旅先ですぐに使えるサポート", translate:"この韓国語を見せる", call:"緊急通報 119", tourist:"観光通訳案内 1330", transport:"交通案内", phrase:"このビーチまでお願いします。", phraseHint:"韓国語フレーズカード", emergencyHelp:"警察 112 · 消防・救急 119", languageHelp:"英語 · 日本語 · 中国語", transitHelp:"地下鉄 · バス · タクシー", sample:"デモデータ", sampleText:"現在の海況は機能確認用のサンプルで、リアルタイムの観測値ではありません。", footer:"海外から訪れる方のための、やさしい釜山ビーチガイド。", reason:"波が穏やかで風も弱いため、初めての方でもグループでゆったり楽しめます。", prep:"日焼け止め、タオル、飲み物をお持ちください。ライフジャケットは現地の受付で借りられます。", open:"持ち物を確認", close:"閉じる", current:"現在地を確認", map:"地図で探す", name:"BUSAN BLUE" },
  zh: { lang:"中文", date:"8月12日 · 釜山", hello:"今天在釜山看海，", accent:"为你找到此刻最合适的玩法。", sub:"从实时海况、海上活动到交通与安全信息，为海外游客提供一站式实用指南。", location:"广安里一带", locate:"使用当前位置", group:"同行人数", groupHelp:"请填写成人和儿童的总人数", mood:"今天想在海边怎么玩？", swim:"海边游泳", surf:"冲浪", family:"亲子游", photo:"拍照打卡", best:"此刻首选推荐", fit:"推荐度", why:"推荐理由", people:"人", ideal:"建议人数", max:"最多容纳", conditions:"实时海况", water:"水温", wave:"浪高", wind:"风速", crowd:"拥挤程度", calm:"体感舒适", low:"海面平稳", light:"风力较弱", relaxed:"较为宽松", more:"你可能也喜欢", route:"查看路线", details:"查看详情", quick:"初到釜山也能安心出行", help:"旅途中随时可用的实用帮助", translate:"向当地人出示这句话", call:"紧急求助 119", tourist:"旅游翻译咨询 1330", transport:"公共交通指南", phrase:"麻烦带我去这个海滩，谢谢。", phraseHint:"韩语沟通卡", emergencyHelp:"报警 112 · 消防急救 119", languageHelp:"英语 · 日语 · 中文", transitHelp:"地铁 · 公交车 · 出租车", sample:"演示数据", sampleText:"当前海况为功能演示数据，并非实时观测结果。", footer:"专为海外游客打造的釜山海滩指南。", reason:"海浪平稳、风力较弱，即使是第一次体验，也能和同伴轻松享受海上时光。", prep:"建议携带防晒霜、毛巾和饮用水。救生衣可在现场服务台租借。", open:"查看随身物品", close:"收起", current:"获取当前位置", map:"在地图上查找", name:"BUSAN BLUE" },
} as const;

const beaches = {
  en: [{name:"Gwangalli Beach", activity:"Sunset SUP", reason:"Best for first-timers", dist:"1.2 km", score:94, icon:"🏄", min:1,max:6},{name:"Songjeong Beach",activity:"Surf lesson",reason:"Clean beginner waves",dist:"7.6 km",score:88,icon:"🏄‍♀️",min:1,max:4},{name:"Suyeong Bay",activity:"Yacht cruise",reason:"Great for groups",dist:"2.8 km",score:85,icon:"⛵",min:4,max:10}],
  ko: [{name:"광안리해수욕장",activity:"노을 SUP 체험",reason:"SUP가 처음인 분께 추천해요",dist:"1.2km",score:94,icon:"🏄",min:1,max:6},{name:"송정해수욕장",activity:"초보 서핑 강습",reason:"파도가 부드러워 연습하기 좋아요",dist:"7.6km",score:88,icon:"🏄‍♀️",min:1,max:4},{name:"수영만",activity:"요트 투어",reason:"여럿이 함께 즐기기 좋아요",dist:"2.8km",score:85,icon:"⛵",min:4,max:10}],
  ja: [{name:"広安里（クァンアンリ）海水浴場",activity:"夕暮れのSUP体験",reason:"初めてのSUPにもおすすめ",dist:"1.2km",score:94,icon:"🏄",min:1,max:6},{name:"松亭（ソンジョン）海水浴場",activity:"初心者向けサーフィンレッスン",reason:"穏やかな波で練習しやすい",dist:"7.6km",score:88,icon:"🏄‍♀️",min:1,max:4},{name:"水営湾（スヨンマン）",activity:"ヨットクルーズ",reason:"グループ旅行にぴったり",dist:"2.8km",score:85,icon:"⛵",min:4,max:10}],
  zh: [{name:"广安里海水浴场",activity:"夕阳桨板体验",reason:"适合第一次体验桨板",dist:"1.2公里",score:94,icon:"🏄",min:1,max:6},{name:"松亭海水浴场",activity:"初学者冲浪课",reason:"海浪平稳，容易上手",dist:"7.6公里",score:88,icon:"🏄‍♀️",min:1,max:4},{name:"水营湾",activity:"游艇观光",reason:"适合多人结伴出行",dist:"2.8公里",score:85,icon:"⛵",min:4,max:10}],
} as const;

const languageNames: Record<Lang,string> = { en:"EN", ko:"한국어", ja:"日本語", zh:"中文" };

export default function Home() {
  const [lang,setLang] = useState<Lang>("en");
  const [people,setPeople] = useState(2);
  const [activity,setActivity] = useState<Activity>("swim");
  const [tips,setTips] = useState(false);
  const [phrase,setPhrase] = useState(false);
  const [location,setLocation] = useState(false);
  const t = copy[lang];
  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : lang;
  }, [lang]);
  const ranked = useMemo(() => {
    const surfWord = lang === "en" ? "surf" : lang === "ko" ? "서핑" : lang === "ja" ? "サーフ" : "冲浪";
    return beaches[lang]
      .map((b) => {
        const groupPoints = people >= b.min && people <= b.max ? 4 : -Math.abs(people - b.min) * 3;
        const familyPoints = activity === "family" && b.max >= 6 ? 4 : 0;
        const surfPoints = activity === "surf" && b.activity.toLowerCase().includes(surfWord) ? 7 : 0;
        return { ...b, match: Math.max(60, Math.min(98, b.score + groupPoints + familyPoints + surfPoints)) };
      })
      .sort((a, b) => b.match - a.match);
  }, [lang, people, activity]);
  const best=ranked[0];
  const moods:[Activity,string,string][]=[["swim","🏊",t.swim],["surf","🏄",t.surf],["family","👨‍👩‍👧",t.family],["photo","📷",t.photo]];

  return <main>
    <header className="nav"><a className="logo" href="#top"><span>〰</span>{t.name}</a><div className="nav-actions"><button className="where" onClick={()=>setLocation(true)}>⌖ {location?t.location:t.current}</button><div className="language" aria-label="Language selector">{(Object.keys(languageNames) as Lang[]).map(l=><button key={l} className={lang===l?"on":""} onClick={()=>setLang(l)} aria-pressed={lang===l}>{languageNames[l]}</button>)}</div></div></header>

    <section className="welcome" id="top">
      <div className="intro"><p className="overline">● LIVE · {t.date}</p><h1>{t.hello}<br/><em>{t.accent}</em></h1><p className="lede">{t.sub}</p>
        <div className="controls"><div className="control-title"><div><strong>{t.group}</strong><small>{t.groupHelp}</small></div><div className="counter"><button onClick={()=>setPeople(Math.max(1,people-1))} disabled={people===1}>−</button><b>{people}</b><span>{t.people}</span><button onClick={()=>setPeople(Math.min(10,people+1))} disabled={people===10}>＋</button></div></div><div className="moods"><span>{t.mood}</span>{moods.map(([id,icon,label])=><button key={id} onClick={()=>setActivity(id)} className={activity===id?"selected":""}>{icon} {label}</button>)}</div></div>
      </div>
      <div className="ocean-card"><div className="sky"><span className="weather">☀️ <b>26°</b></span><div className="bridge">BUSAN</div></div><div className="sea"><span className="board">🏄</span></div><div className="condition-strip"><div><span>{t.water}</span><b>23.8°C</b><small>{t.calm}</small></div><div><span>{t.wave}</span><b>0.4 m</b><small>{t.low}</small></div><div><span>{t.wind}</span><b>2.4 m/s</b><small>{t.light}</small></div><div><span>{t.crowd}</span><b>32%</b><small>{t.relaxed}</small></div></div></div>
    </section>

    <section className="best"><div className="best-head"><div><span>{t.best} · {people} {t.people}</span><h2>{best.name}</h2></div><div className="score"><b>{best.match}</b><small>% {t.fit}</small></div></div><div className="best-grid"><div className="art"><span>{best.icon}</span><b>{best.activity}</b></div><div className="best-info"><span className="label">{t.why}</span><h3>{t.reason}</h3><div className="fit-row"><span>👥 {t.ideal}: {best.min}–{best.max} {t.people}</span><span>✓ {best.reason}</span></div><div className="actions"><button className="primary" onClick={()=>setTips(!tips)}>{tips?t.close:t.open} →</button><button>⌖ {t.route}</button></div>{tips&&<p className="tip">{t.prep}</p>}</div></div></section>

    <section className="choices"><div className="title-row"><div><span>{t.conditions}</span><h2>{t.more}</h2></div><button>{t.map} ↗</button></div><div className="beach-grid">{ranked.slice(1).map((b,i)=><article key={b.name}><div className="beach-art"><span className="rank">0{i+2}</span><span>{b.icon}</span><b>{b.match}%</b></div><div className="card-body"><small>{b.dist}</small><h3>{b.name}</h3><strong>{b.activity}</strong><p>{b.reason}</p><button>{t.details} →</button></div></article>)}</div></section>

    <section className="traveler"><div><span>{t.quick}</span><h2>{t.help}</h2></div><div className="help-grid"><button onClick={()=>setPhrase(!phrase)}><i>💬</i><strong>{t.translate}</strong><small>{phrase?t.phrase:t.phraseHint}</small></button><a href="tel:119"><i>🛟</i><strong>{t.call}</strong><small>{t.emergencyHelp}</small></a><a href="tel:1330"><i>🎧</i><strong>{t.tourist}</strong><small>{t.languageHelp}</small></a><button><i>🚇</i><strong>{t.transport}</strong><small>{t.transitHelp}</small></button></div><p className="demo"><b>{t.sample}</b> · {t.sampleText}</p></section>
    <footer><a className="logo" href="#top"><span>〰</span>{t.name}</a><p>{t.footer}</p><small>© 2026 BUSAN BLUE</small></footer>
  </main>;
}
