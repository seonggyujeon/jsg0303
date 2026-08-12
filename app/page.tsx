"use client";

import { useMemo, useState } from "react";

type Preference = "처음이에요" | "가볍게" | "짜릿하게" | "아이와 함께";

const activities = [
  {
    id: "paddle",
    title: "광안리 SUP 패들보드",
    place: "광안리해수욕장",
    emoji: "🏄",
    color: "aqua",
    time: "오전 10:00–12:00",
    distance: 1.2,
    score: 94,
    temp: 26,
    water: 23.8,
    wind: 2.4,
    crowd: 32,
    level: "초보 추천",
    tags: ["처음이에요", "가볍게", "아이와 함께"],
    reason: "잔잔한 파도와 약한 바람으로 처음 타기 가장 편안해요.",
  },
  {
    id: "yacht",
    title: "수영만 요트 투어",
    place: "수영만요트경기장",
    emoji: "⛵",
    color: "sunset",
    time: "오후 5:30–7:00",
    distance: 2.8,
    score: 89,
    temp: 25,
    water: 23.5,
    wind: 3.1,
    crowd: 54,
    level: "누구나",
    tags: ["처음이에요", "가볍게", "아이와 함께"],
    reason: "맑은 시야와 적당한 바람이 있어 노을 항해에 좋아요.",
  },
  {
    id: "kayak",
    title: "송정 투명 카약",
    place: "송정해수욕장",
    emoji: "🛶",
    color: "blue",
    time: "오후 2:00–4:00",
    distance: 7.6,
    score: 83,
    temp: 27,
    water: 24.1,
    wind: 3.8,
    crowd: 41,
    level: "보통",
    tags: ["가볍게", "짜릿하게"],
    reason: "수온이 따뜻하고 시야가 좋아 바다 위 풍경을 즐기기 좋아요.",
  },
];

const preferences: Preference[] = ["처음이에요", "가볍게", "짜릿하게", "아이와 함께"];

export default function Home() {
  const [preference, setPreference] = useState<Preference>("처음이에요");
  const [location, setLocation] = useState("광안리 인근");
  const [locating, setLocating] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const ranked = useMemo(() => {
    return activities
      .map((activity) => ({
        ...activity,
        match: Math.min(98, activity.score + (activity.tags.includes(preference) ? 3 : -5)),
      }))
      .sort((a, b) => b.match - a.match);
  }, [preference]);

  function findLocation() {
    setLocating(true);
    if (!navigator.geolocation) {
      setLocation("위치를 지원하지 않는 기기");
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocation("현재 위치 확인됨");
        setLocating(false);
      },
      () => {
        setLocation("광안리 인근");
        setLocating(false);
      },
      { timeout: 6000 },
    );
  }

  const best = ranked[0];

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="오늘의 바다 홈">
          <span className="brand-mark">물결</span>
          <span>오늘의 바다</span>
        </a>
        <button className="location-button" onClick={findLocation} disabled={locating}>
          <span className="location-dot" aria-hidden="true" />
          {locating ? "위치 찾는 중…" : location}
          <span aria-hidden="true">⌄</span>
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span>LIVE</span> 8월 12일 · 부산</div>
          <h1>오늘 바다에서<br /><em>뭐 하고 놀까요?</em></h1>
          <p>날씨와 바다 상태, 혼잡도까지 한 번에 보고<br className="desktop-break" /> 지금 가장 즐기기 좋은 활동을 골라드려요.</p>
          <div className="preference-wrap">
            <span>오늘은</span>
            <div className="chips" aria-label="활동 취향 선택">
              {preferences.map((item) => (
                <button
                  key={item}
                  className={preference === item ? "chip active" : "chip"}
                  onClick={() => setPreference(item)}
                  aria-pressed={preference === item}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sea-window" aria-label="오늘 부산 바다 상태">
          <div className="sun" />
          <div className="cloud cloud-one" />
          <div className="cloud cloud-two" />
          <div className="weather-float">
            <span className="weather-icon">☀</span>
            <div><strong>26°</strong><small>맑고 선선해요</small></div>
          </div>
          <div className="wave wave-back" />
          <div className="wave wave-front" />
          <div className="buoy"><span>BUSAN</span></div>
          <div className="sea-stats">
            <div><span>수온</span><strong>23.8°C</strong></div>
            <div><span>바람</span><strong>남동 2.4m/s</strong></div>
            <div><span>파고</span><strong>0.4m</strong></div>
          </div>
        </div>
      </section>

      <section className="recommendation">
        <div className="section-heading">
          <div>
            <span className="kicker">오늘의 1순위</span>
            <h2>{best.title}</h2>
          </div>
          <div className="match-ring"><strong>{best.match}</strong><span>%<br />적합</span></div>
        </div>

        <div className="best-card">
          <div className="best-visual">
            <span className="big-emoji" aria-hidden="true">{best.emoji}</span>
            <span className="visual-label">바다 위에서 보는 광안대교</span>
          </div>
          <div className="best-content">
            <div className="reason-label">추천하는 이유</div>
            <p className="reason">“{best.reason}”</p>
            <div className="metrics">
              <div><span>🌡️ 수온</span><strong>{best.water}°C</strong><small>쾌적</small></div>
              <div><span>💨 바람</span><strong>{best.wind}m/s</strong><small>약함</small></div>
              <div><span>👥 혼잡도</span><strong>{best.crowd}%</strong><small>여유</small></div>
            </div>
            <div className="best-footer">
              <div className="trip-meta">
                <span>◉ {best.place}</span>
                <span>도보 약 16분 · {best.distance}km</span>
              </div>
              <button className="primary-button" onClick={() => setExpanded(expanded === best.id ? null : best.id)}>
                {expanded === best.id ? "준비물 접기" : "준비물과 이용 팁"} <span>→</span>
              </button>
            </div>
            {expanded === best.id && (
              <div className="tip-box">수건, 선크림, 여벌 옷을 챙겨주세요. 오전에는 바람이 더 잔잔해 초보자에게 특히 좋아요.</div>
            )}
          </div>
        </div>
      </section>

      <section className="alternatives">
        <div className="section-title-row">
          <div><span className="kicker dark">다른 선택지도 좋아요</span><h2>내 주변 추천</h2></div>
          <button className="text-button">지도에서 보기 <span>↗</span></button>
        </div>
        <div className="card-grid">
          {ranked.slice(1).map((activity, index) => (
            <article className="activity-card" key={activity.id}>
              <div className={`activity-visual ${activity.color}`}>
                <span className="card-rank">{index + 2}</span>
                <span className="card-emoji" aria-hidden="true">{activity.emoji}</span>
                <span className="match-badge">{activity.match}% 적합</span>
              </div>
              <div className="activity-content">
                <span className="activity-place">{activity.place} · {activity.distance}km</span>
                <h3>{activity.title}</h3>
                <p>{activity.reason}</p>
                <div className="activity-meta"><span>{activity.level}</span><span>{activity.time}</span></div>
              </div>
            </article>
          ))}
          <article className="activity-card safety-card">
            <div>
              <span className="safety-icon">✓</span>
              <span className="activity-place">오늘의 해양 안전</span>
              <h3>대부분 활동하기<br />좋은 날이에요</h3>
              <p>오후 4시 이후 해운대 앞바다의 바람이 조금 강해질 수 있어요.</p>
            </div>
            <button onClick={() => setExpanded(expanded === "safety" ? null : "safety")}>안전 정보 {expanded === "safety" ? "접기" : "자세히"} →</button>
            {expanded === "safety" && <small>구명조끼를 착용하고, 운영 업체의 현장 통제와 기상특보를 우선 확인하세요.</small>}
          </article>
        </div>
      </section>

      <section className="how-it-works">
        <span className="kicker dark">어떻게 골랐나요?</span>
        <h2>오늘의 바다 추천 기준</h2>
        <div className="formula">
          <div><span>01</span><strong>바다 컨디션</strong><small>수온 · 파고 · 조류</small></div>
          <i>+</i>
          <div><span>02</span><strong>날씨와 안전</strong><small>기온 · 바람 · 특보</small></div>
          <i>+</i>
          <div><span>03</span><strong>나와의 거리</strong><small>현재 위치 · 이동시간</small></div>
          <i>+</i>
          <div><span>04</span><strong>현장 분위기</strong><small>혼잡도 · 내 취향</small></div>
        </div>
        <p className="data-note"><span>i</span> 현재 화면은 서비스 검증용 예시 데이터입니다. 실제 운영 시 기상청·해양수산부·부산시 데이터와 현장 혼잡 정보를 연동합니다.</p>
      </section>

      <footer>
        <div className="brand footer-brand"><span className="brand-mark">물결</span><span>오늘의 바다</span></div>
        <p>부산의 바다를 가장 좋은 순간에.</p>
        <span>© 2026 오늘의 바다 · 부산</span>
      </footer>
    </main>
  );
}
