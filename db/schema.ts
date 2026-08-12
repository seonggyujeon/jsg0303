import { index, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const places = sqliteTable("places", {
  id: text("id").primaryKey(),
  nameEn: text("name_en").notNull(),
  nameKo: text("name_ko").notNull(),
  nameJa: text("name_ja").notNull(),
  nameZh: text("name_zh").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  icon: text("icon").notNull(),
  activityKind: text("activity_kind").notNull(),
  categories: text("categories").notNull(),
  baselineCrowd: integer("baseline_crowd").notNull(),
  groupMin: integer("group_min").notNull(),
  groupMax: integer("group_max").notNull(),
  addressKo: text("address_ko").notNull(),
  sourceUrl: text("source_url").notNull(),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
}, (table) => [index("idx_places_active_kind").on(table.active, table.activityKind)]);

export const activities = sqliteTable("activities", {
  id: text("id").primaryKey(),
  placeId: text("place_id").notNull().references(() => places.id),
  titleEn: text("title_en").notNull(),
  titleKo: text("title_ko").notNull(),
  titleJa: text("title_ja").notNull(),
  titleZh: text("title_zh").notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionKo: text("description_ko").notNull(),
  descriptionJa: text("description_ja").notNull(),
  descriptionZh: text("description_zh").notNull(),
  requiresReservation: integer("requires_reservation", { mode: "boolean" }).notNull().default(false),
  minAge: integer("min_age"),
  safetyNoteKo: text("safety_note_ko").notNull(),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
}, (table) => [index("idx_activities_place_active").on(table.placeId, table.active)]);

export const conditionSnapshots = sqliteTable("condition_snapshots", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  placeId: text("place_id").notNull().references(() => places.id),
  observedAt: text("observed_at").notNull(),
  temperature: real("temperature").notNull(),
  precipitation: real("precipitation").notNull(),
  windSpeed: real("wind_speed").notNull(),
  waveHeight: real("wave_height").notNull(),
  waterTemperature: real("water_temperature").notNull(),
  source: text("source").notNull(),
}, (table) => [index("idx_snapshots_place_time").on(table.placeId, table.observedAt)]);
