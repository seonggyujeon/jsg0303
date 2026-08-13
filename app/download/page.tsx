import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "오션로그 다운로드 | Ocean Log Android 앱",
  description:
    "부산 해양활동 여행 가이드 오션로그(Ocean Log) 안드로이드 앱 다운로드 및 설치 안내 페이지입니다.",
  keywords: [
    "오션로그",
    "Ocean Log",
    "오션로그 다운로드",
    "Ocean Log 다운로드",
    "부산 해양활동",
    "부산 여행 앱",
    "Android 앱",
  ],
  alternates: {
    canonical: "https://jsg0303.vercel.app/download",
  },
  openGraph: {
    title: "오션로그 Ocean Log - Android 앱 다운로드",
    description:
      "부산의 해안 장소와 해양활동을 연결하는 Ocean Log 안드로이드 앱을 다운로드하세요.",
    url: "https://jsg0303.vercel.app/download",
    siteName: "Ocean Log",
    locale: "ko_KR",
    type: "website",
  },
};

const androidBuildUrl =
  "https://github.com/seonggyujeon/jsg0303/actions/workflows/build-android-apk.yml";

export default function DownloadPage() {
  const softwareApplicationJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Ocean Log",
    alternateName: "오션로그",
    operatingSystem: "Android",
    applicationCategory: "TravelApplication",
    description:
      "부산의 해안 장소와 해양활동 정보를 여행자의 조건에 맞게 연결하는 여행 가이드 앱입니다.",
    url: "https://jsg0303.vercel.app/download",
    downloadUrl: androidBuildUrl,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #eaf7ff 0%, #f8fcff 48%, #ffffff 100%)",
        color: "#0f2940",
        fontFamily: "inherit",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationJsonLd),
        }}
      />

      <section
        style={{
          width: "min(760px, calc(100% - 32px))",
          margin: "0 auto",
          padding: "72px 0 64px",
        }}
      >
        <a
          href="/home"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: "#0878c9",
            textDecoration: "none",
            fontWeight: 700,
            marginBottom: 28,
          }}
        >
          ← Ocean Log 홈으로
        </a>

        <div
          style={{
            background: "rgba(255,255,255,0.94)",
            border: "1px solid rgba(9, 116, 190, 0.14)",
            borderRadius: 28,
            padding: "clamp(28px, 6vw, 56px)",
            boxShadow: "0 24px 70px rgba(30, 105, 155, 0.12)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "7px 12px",
              borderRadius: 999,
              background: "#e7f5ff",
              color: "#0878c9",
              fontSize: 14,
              fontWeight: 800,
              marginBottom: 18,
            }}
          >
            Android 앱
          </div>

          <h1
            style={{
              fontSize: "clamp(34px, 7vw, 58px)",
              lineHeight: 1.05,
              letterSpacing: "-0.045em",
              margin: "0 0 18px",
            }}
          >
            오션로그
            <br />
            Ocean Log
          </h1>

          <p
            style={{
              fontSize: "clamp(17px, 2.5vw, 21px)",
              lineHeight: 1.65,
              color: "#48677f",
              margin: "0 0 30px",
            }}
          >
            부산의 해안 장소와 해양활동을 한 곳에서 확인하세요. Android
            기기에서는 Ocean Log를 앱으로 설치해 홈 화면의 아이콘으로 바로
            실행할 수 있습니다.
          </p>

          <a
            href={androidBuildUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "flex",
              width: "100%",
              boxSizing: "border-box",
              minHeight: 58,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 16,
              background: "#0878c9",
              color: "white",
              fontSize: 17,
              fontWeight: 900,
              textDecoration: "none",
              boxShadow: "0 12px 28px rgba(8, 120, 201, 0.22)",
            }}
          >
            Android 앱 다운로드
          </a>

          <p
            style={{
              margin: "12px 0 0",
              color: "#6e8799",
              fontSize: 13,
              lineHeight: 1.6,
              textAlign: "center",
            }}
          >
            현재 테스트 배포 버전입니다. 다운로드 페이지에서 최신 Android
            빌드의 APK를 받아 설치할 수 있습니다.
          </p>

          <div
            style={{
              height: 1,
              background: "#e5eef4",
              margin: "34px 0",
            }}
          />

          <h2 style={{ margin: "0 0 18px", fontSize: 24 }}>설치 방법</h2>
          <ol
            style={{
              margin: 0,
              paddingLeft: 24,
              color: "#48677f",
              lineHeight: 1.9,
              fontSize: 16,
            }}
          >
            <li>위의 Android 앱 다운로드 버튼을 누릅니다.</li>
            <li>가장 최근에 성공한 Android APK 빌드를 엽니다.</li>
            <li>Artifacts의 ocean-log-android-debug-apk 파일을 받습니다.</li>
            <li>ZIP 압축을 풀고 app-debug.apk를 실행합니다.</li>
            <li>설치가 끝나면 홈 화면의 Ocean Log 아이콘을 눌러 실행합니다.</li>
          </ol>

          <div
            style={{
              marginTop: 28,
              padding: 18,
              borderRadius: 16,
              background: "#f2f8fc",
              color: "#527086",
              fontSize: 14,
              lineHeight: 1.65,
            }}
          >
            Android 보안 설정에 따라 처음 설치할 때 “이 출처의 앱 설치 허용”
            안내가 표시될 수 있습니다. 설치 후에는 일반 앱과 동일하게 홈 화면
            아이콘으로 실행할 수 있습니다.
          </div>
        </div>

        <footer
          style={{
            textAlign: "center",
            color: "#7890a1",
            fontSize: 13,
            marginTop: 24,
          }}
        >
          Ocean Log · 부산 해양활동 여행 가이드
        </footer>
      </section>
    </main>
  );
}
