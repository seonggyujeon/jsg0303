"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FeatureScreen } from "@/components/layout/FeatureScreen";
import { getContentModuleSlot } from "@/data/module-slots";
import { useAdminMode } from "@/lib/admin/AdminModeProvider";
import { useAppFlow } from "@/lib/app-flow/AppFlowProvider";
import { DEFAULT_UNIT_PREFERENCES, readUnitPreferences, writeUnitPreferences, type DistanceUnit, type TemperatureUnit, type UnitPreferences } from "@/lib/preferences/units";
import type { LocalizedText } from "@/types/i18n";

const TITLE: LocalizedText = { ko: "앱 설정을 바꿔요", zh: "调整应用设置", ja: "アプリ設定を変更", en: "Adjust app settings" };
const DESCRIPTION: LocalizedText = { ko: "언어와 표시 단위를 여행 방식에 맞게 선택하세요.", zh: "根据你的出行方式选择语言和显示单位。", ja: "旅のスタイルに合わせて言語と表示単位を選べます。", en: "Choose the language and display units that suit your trip." };
const OPEN_ACTION: LocalizedText = { ko: "언어와 단위 설정 열기", zh: "打开语言与单位设置", ja: "言語と単位の設定を開く", en: "Open language and unit settings" };

const LABELS = {
  language: { ko: "언어", zh: "语言", ja: "言語", en: "Language" },
  languageHint: { ko: "한국어 · 中文 · 日本語 · English", zh: "한국어 · 中文 · 日本語 · English", ja: "한국어 · 中文 · 日本語 · English", en: "한국어 · 中文 · 日本語 · English" },
  chooseLanguage: { ko: "언어 다시 선택", zh: "重新选择语言", ja: "言語を選び直す", en: "Choose language again" },
  units: { ko: "단위", zh: "单位", ja: "単位", en: "Units" },
  temperature: { ko: "온도", zh: "温度", ja: "温度", en: "Temperature" },
  distance: { ko: "거리", zh: "距离", ja: "距離", en: "Distance" },
  saved: { ko: "선택한 단위가 저장되었어요.", zh: "所选单位已保存。", ja: "選択した単位を保存しました。", en: "Your unit choices are saved." },
  admin: { ko: "관리자 모드", zh: "管理员模式", ja: "管理者モード", en: "Admin mode" },
  adminHint: { ko: "관리자만 여행자 후기와 첨부 파일을 삭제할 수 있어요.", zh: "仅管理员可以删除旅行者帖子和附件。", ja: "管理者のみ投稿と添付ファイルを削除できます。", en: "Only admins can delete traveler posts and attachments." },
  password: { ko: "관리자 비밀번호", zh: "管理员密码", ja: "管理者パスワード", en: "Admin password" },
  activate: { ko: "관리자 모드 활성화", zh: "启用管理员模式", ja: "管理者モードを有効化", en: "Activate admin mode" },
  deactivate: { ko: "관리자 모드 종료", zh: "退出管理员模式", ja: "管理者モードを終了", en: "Exit admin mode" },
  active: { ko: "관리자 모드가 활성화되었어요.", zh: "管理员模式已启用。", ja: "管理者モードが有効です。", en: "Admin mode is active." },
  invalidPassword: { ko: "비밀번호가 올바르지 않아요.", zh: "密码不正确。", ja: "パスワードが正しくありません。", en: "The password is incorrect." },
} satisfies Record<string, LocalizedText>;

export function SettingsScreen() {
  const router = useRouter();
  const { locale } = useAppFlow();
  const { isAdmin, activateAdminMode, deactivateAdminMode } = useAdminMode();
  const activeLocale = locale ?? "en";
  const [isOpen, setIsOpen] = useState(false);
  const [units, setUnits] = useState<UnitPreferences>(DEFAULT_UNIT_PREFERENCES);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  useEffect(() => {
    const hydrationTask = window.setTimeout(() => setUnits(readUnitPreferences()), 0);
    return () => window.clearTimeout(hydrationTask);
  }, []);

  const updateTemperature = (temperature: TemperatureUnit) => {
    const next = { ...units, temperature };
    setUnits(next);
    writeUnitPreferences(next);
  };

  const updateDistance = (distance: DistanceUnit) => {
    const next = { ...units, distance };
    setUnits(next);
    writeUnitPreferences(next);
  };

  const submitAdminPassword = async (event: FormEvent) => {
    event.preventDefault();
    const accepted = await activateAdminMode(adminPassword);
    if (accepted) {
      setAdminPassword("");
      setAdminError("");
    } else {
      setAdminError(LABELS.invalidPassword[activeLocale]);
    }
  };

  return (
    <FeatureScreen
      description={DESCRIPTION}
      footer={isOpen ? (
        <section className="ol-preferences" aria-label={OPEN_ACTION[activeLocale]}>
          <article className="ol-preference-card">
            <div><span aria-hidden="true">文</span><div><h2>{LABELS.language[activeLocale]}</h2><p>{LABELS.languageHint[activeLocale]}</p></div></div>
            <button onClick={() => router.push("/language")} type="button">{LABELS.chooseLanguage[activeLocale]} <span aria-hidden="true">→</span></button>
          </article>
          <article className="ol-preference-card">
            <div><span aria-hidden="true">↔</span><div><h2>{LABELS.units[activeLocale]}</h2><p>{LABELS.saved[activeLocale]}</p></div></div>
            <fieldset><legend>{LABELS.temperature[activeLocale]}</legend><div className="ol-segmented-control">
              <button aria-pressed={units.temperature === "celsius"} className={units.temperature === "celsius" ? "is-active" : ""} onClick={() => updateTemperature("celsius")} type="button">°C</button>
              <button aria-pressed={units.temperature === "fahrenheit"} className={units.temperature === "fahrenheit" ? "is-active" : ""} onClick={() => updateTemperature("fahrenheit")} type="button">°F</button>
            </div></fieldset>
            <fieldset><legend>{LABELS.distance[activeLocale]}</legend><div className="ol-segmented-control">
              <button aria-pressed={units.distance === "meter"} className={units.distance === "meter" ? "is-active" : ""} onClick={() => updateDistance("meter")} type="button">m</button>
              <button aria-pressed={units.distance === "mile"} className={units.distance === "mile" ? "is-active" : ""} onClick={() => updateDistance("mile")} type="button">mile</button>
            </div></fieldset>
          </article>
          <article className="ol-preference-card ol-admin-card">
            <div><span aria-hidden="true">◆</span><div><h2>{LABELS.admin[activeLocale]}</h2><p>{isAdmin ? LABELS.active[activeLocale] : LABELS.adminHint[activeLocale]}</p></div></div>
            {isAdmin ? <button className="ol-admin-exit" onClick={deactivateAdminMode} type="button">{LABELS.deactivate[activeLocale]} <span aria-hidden="true">×</span></button> : <form onSubmit={submitAdminPassword}>
              <label htmlFor="admin-password">{LABELS.password[activeLocale]}</label>
              <div><input autoComplete="current-password" id="admin-password" onChange={(event) => { setAdminPassword(event.target.value); setAdminError(""); }} type="password" value={adminPassword} /><button disabled={!adminPassword} type="submit">{LABELS.activate[activeLocale]}</button></div>
              {adminError && <p role="alert">{adminError}</p>}
            </form>}
          </article>
        </section>
      ) : undefined}
      hideIntro
      number="05"
      onSlotActivate={() => setIsOpen((current) => !current)}
      slot={getContentModuleSlot("settings")}
      slotActionLabel={OPEN_ACTION[activeLocale]}
      title={TITLE}
    />
  );
}
