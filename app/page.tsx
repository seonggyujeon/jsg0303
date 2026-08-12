"use client";

import { useMemo, useState } from "react";

type Lang = "en" | "ko" | "ja" | "zh";
type Activity = "swim" | "surf" | "family" | "photo";

const copy = {
  en: { lang:"English", date:"AUG 12 · BUSAN", hello:"Your best beach day in Busan,", accent:"planned in seconds.", sub:"Live sea conditions, local activities and practical travel help — made for international visitors.", location:"Near Gwangalli", locate:"Use my location", group:"Your group", groupHelp:"Total people joining today", mood:"What are you here for?", swim:"Swimming", surf:"Surfing", family:"Family", photo:"Photo spots", best:"BEST FOR YOU NOW", fit:"match", why:"Why this works", people:"people", ideal:"Ideal group", max:"Max", conditions:"LIVE SEA CONDITIONS", water:"Water", wave:"Waves", wind:"Wind", crowd:"Crowd", calm:"Comfortable", low:"Low", light:"Light", relaxed:"Relaxed", more:"Other beaches for you", route:"Directions", details:"View details", quick:"TRAVEL WITH CONFIDENCE", help:"Essential help in Busan", translate:"Show this phrase", call:"Emergency 119", tourist:"Tourist helpline 1330", transport:"Transit guide", phrase:"Please help me get to this beach.", sample:"Demo data", sampleText:"Sea conditions shown here are sample data for product testing.", footer:"Your friendly guide to Busan’s coast.", reason:"Gentle waves and light wind make this the easiest, most scenic choice for your group.", prep:"Bring sunscreen, a towel and water. Life jackets are available at the activity desk.", open:"What to bring", close:"Close tips", current:"Current location", map:"Explore map", name:"BUSAN BLUE" },
  ko: { lang:"한국어", date:"8월 12일 · 부산", hello:"부산에서 가장 좋은 바다 하루를,", accent:"몇 초 만에 골라드려요.", sub:"실시간 바다 상태와 현지 액티비티, 여행에 필요한 안내를 외국인 관광객 눈높이에 맞췄어요.", location:"광안리 인근", locate:"현재 위치 사용", group:"현재 인원", groupHelp:"오늘 함께 활동할 전체 인원", mood:"어떤 시간을 원하세요?", swim:"수영", surf:"서핑", family:"가족 여행", photo:"사진 명소", best:"지금 가장 잘 맞아요", fit:"적합", why:"추천하는 이유", people:"명", ideal:"적정 인원", max:"최대", conditions:"실시간 바다 상태", water:"수온", wave:"파고", wind:"바람", crowd:"혼잡도", calm:"쾌적", low:"낮음", light:"약함", relaxed:"여유", more:"다른 해변 추천", route:"길찾기", details:"자세히 보기", quick:"안심하고 여행하세요", help:"부산 여행 필수 도움", translate:"이 문장 보여주기", call:"긴급전화 119", tourist:"관광안내 1330", transport:"대중교통 안내", phrase:"이 해변까지 갈 수 있게 도와주세요.", sample:"예시 데이터", sampleText:"현재 해상 정보는 제품 검증을 위한 예시 수치입니다.", footer:"외국인을 위한 친절한 부산 바다 안내.", reason:"잔잔한 파도와 약한 바람 덕분에 일행과 편하고 아름답게 즐기기 좋아요.", prep:"선크림, 수건, 물을 준비하세요. 현장 안내소에서 구명조끼를 이용할 수 있어요.", open:"준비물 보기", close:"준비물 닫기", current:"현재 위치", map:"지도 탐색", name:"BUSAN BLUE" },
  ja: { lang:"日本語", date:"8月12日 · 釜山", hello:"釜山で最高のビーチ時間を、", accent:"数秒で見つけます。", sub:"リアルタイムの海況、アクティビティ、旅行情報を外国人旅行者向けにまとめました。", location:"広安里付近", locate:"現在地を使う", group:"人数", groupHelp:"今日一緒に参加する人数", mood:"何を楽しみたいですか？", swim:"水泳", surf:"サーフィン", family:"家族旅行", photo:"写真スポット", best:"今のベストチョイス", fit:"適合", why:"おすすめの理由", people:"名", ideal:"最適人数", max:"最大", conditions:"リアルタイム海況", water:"水温", wave:"波高", wind:"風", crowd:"混雑度", calm:"快適", low:"低い", light:"弱い", relaxed:"余裕", more:"ほかのビーチ", route:"行き方", details:"詳細を見る", quick:"安心して旅行", help:"釜山旅行の便利情報", translate:"この文を見せる", call:"緊急電話 119", tourist:"観光案内 1330", transport:"交通案内", phrase:"このビーチまで行けるように手伝ってください。", sample:"サンプルデータ", sampleText:"現在の海況は製品テスト用のサンプルです。", footer:"外国人旅行者のための釜山ビーチガイド。", reason:"穏やかな波と弱い風で、グループでも気軽に美しい海を楽しめます。", prep:"日焼け止め、タオル、水をご用意ください。救命胴衣は現地で利用できます。", open:"持ち物を見る", close:"閉じる", current:"現在地", map:"地図を見る", name:"BUSAN BLUE" },
  zh: { lang:"中文", date:"8月12日 · 釜山", hello:"在釜山享受最棒的海滩时光，", accent:"几秒钟就能选好。", sub:"面向外国游客，提供实时海况、本地活动及实用旅行指南。", location:"广安里附近", locate:"使用当前位置", group:"同行人数", groupHelp:"今天参加活动的总人数", mood:"您想体验什么？", swim:"游泳", surf:"冲浪", family:"亲子旅行", photo:"拍照景点", best:"此刻最适合您", fit:"匹配", why:"推荐理由", people:"人", ideal:"最佳人数", max:"最多", conditions:"实时海况", water:"水温", wave:"浪高", wind:"风速", crowd:"拥挤度", calm:"舒适", low:"较低", light:"微风", relaxed:"宽松", more:"其他海滩推荐", route:"路线", details:"查看详情", quick:"安心畅游", help:"釜山旅行实用帮助", translate:"出示这句话", call:"紧急电话 119", tourist:"旅游咨询 1330", transport:"交通指南", phrase:"请帮我前往这个海滩。", sample:"示例数据", sampleText:"当前海况为产品测试所用的示例数据。", footer:"为外国游客准备的友好釜山海滩指南。", reason:"海浪平缓、风力较弱，非常适合与同行伙伴轻松欣赏海景。", prep:"请携带防晒霜、毛巾和饮用水。现场可租用救生衣。", open:"查看准备物品", close:"收起", current:"当前位置", map:"查看地图", name:"BUSAN BLUE" },
} as const;

const beaches = {
  en: [{name:"Gwangalli Beach", activity:"Sunset SUP", reason:"Best for first-timers", dist:"1.2 km", score:94, icon:"🏄", min:1,max:6},{name:"Songjeong Beach",activity:"Surf lesson",reason:"Clean beginner waves",dist:"7.6 km",score:88,icon:"🏄‍♀️",min:1,max:4},{name:"Suyeong Bay",activity:"Yacht cruise",reason:"Great for groups",dist:"2.8 km",score:85,icon:"⛵",min:4,max:10}],
  ko: [{name:"광안리해수욕장",activity:"선셋 SUP",reason:"초보자에게 가장 편안해요",dist:"1.2km",score:94,icon:"🏄",min:1,max:6},{name:"송정해수욕장",activity:"서핑 강습",reason:"입문자에게 좋은 파도",dist:"7.6km",score:88,icon:"🏄‍♀️",min:1,max:4},{name:"수영만",activity:"요트 크루즈",reason:"단체 여행에 좋아요",dist:"2.8km",score:85,icon:"⛵",min:4,max:10}],
  ja: [{name:"広安里海水浴場",activity:"サンセットSUP",reason:"初心者に最適",dist:"1.2km",score:94,icon:"🏄",min:1,max:6},{name:"松亭海水浴場",activity:"サーフィン体験",reason:"初心者向けの波",dist:"7.6km",score:88,icon:"🏄‍♀️",min:1,max:4},{name:"水営湾",activity:"ヨットクルーズ",reason:"グループに最適",dist:"2.8km",score:85,icon:"⛵",min:4,max:10}],
  zh: [{name:"广安里海水浴场",activity:"日落立式划桨",reason:"最适合初学者",dist:"1.2公里",score:94,icon:"🏄",min:1,max:6},{name:"松亭海水浴场",activity:"冲浪课程",reason:"适合入门的海浪",dist:"7.6公里",score:88,icon:"🏄‍♀️",min:1,max:4},{name:"水营湾",activity:"游艇巡航",reason:"适合团体出游",dist:"2.8公里",score:85,icon:"⛵",min:4,max:10}],
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

    <section className="traveler"><div><span>{t.quick}</span><h2>{t.help}</h2></div><div className="help-grid"><button onClick={()=>setPhrase(!phrase)}><i>💬</i><strong>{t.translate}</strong><small>{phrase?t.phrase:"Korean phrase card"}</small></button><a href="tel:119"><i>🛟</i><strong>{t.call}</strong><small>Police 112 · Fire & rescue 119</small></a><a href="tel:1330"><i>🎧</i><strong>{t.tourist}</strong><small>English · 日本語 · 中文</small></a><button><i>🚇</i><strong>{t.transport}</strong><small>Subway · bus · taxi</small></button></div><p className="demo"><b>{t.sample}</b> · {t.sampleText}</p></section>
    <footer><a className="logo" href="#top"><span>〰</span>{t.name}</a><p>{t.footer}</p><small>© 2026 BUSAN BLUE</small></footer>
  </main>;
}
