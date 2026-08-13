import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "오션로그 iPhone | Ocean Log iOS",
  description: "iPhone과 iPad에서 Ocean Log를 이용하기 위한 iOS 전용 바로가기 페이지입니다.",
  alternates: { canonical: "https://jsg0303.vercel.app/ios" },
};

export default function IOSPage() {
  return (
    <main style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:24,background:"linear-gradient(180deg,#eaf7ff,#fff)",color:"#0f2940"}}>
      <section style={{width:"min(560px,100%)",background:"#fff",borderRadius:28,padding:"clamp(28px,7vw,52px)",boxShadow:"0 24px 70px rgba(30,105,155,.12)",textAlign:"center"}}>
        <div style={{fontSize:52,marginBottom:12}}>🌊</div>
        <h1 style={{fontSize:"clamp(32px,8vw,48px)",margin:"0 0 14px",letterSpacing:"-.04em"}}>Ocean Log</h1>
        <p style={{fontSize:17,lineHeight:1.7,color:"#557287",margin:"0 0 28px"}}>iPhone · iPad 전용 바로가기입니다. 아래 버튼을 누르면 Ocean Log가 바로 열립니다.</p>
        <a href="/home" style={{display:"flex",minHeight:58,alignItems:"center",justifyContent:"center",borderRadius:16,background:"#0878c9",color:"#fff",fontSize:17,fontWeight:900,textDecoration:"none"}}>iPhone에서 Ocean Log 열기</a>
        <p style={{fontSize:13,lineHeight:1.6,color:"#7890a1",margin:"18px 0 0"}}>Safari에서 열어 공유 → 홈 화면에 추가를 선택하면 앱 아이콘처럼 실행할 수 있습니다.</p>
      </section>
    </main>
  );
}
