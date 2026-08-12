CREATE TABLE `places` (
  `id` text PRIMARY KEY NOT NULL,
  `name_en` text NOT NULL,
  `name_ko` text NOT NULL,
  `name_ja` text NOT NULL,
  `name_zh` text NOT NULL,
  `latitude` real NOT NULL,
  `longitude` real NOT NULL,
  `icon` text NOT NULL,
  `activity_kind` text NOT NULL,
  `categories` text NOT NULL,
  `baseline_crowd` integer NOT NULL,
  `group_min` integer NOT NULL,
  `group_max` integer NOT NULL,
  `address_ko` text NOT NULL,
  `source_url` text NOT NULL,
  `active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `activities` (
  `id` text PRIMARY KEY NOT NULL,
  `place_id` text NOT NULL,
  `title_en` text NOT NULL,
  `title_ko` text NOT NULL,
  `title_ja` text NOT NULL,
  `title_zh` text NOT NULL,
  `description_en` text NOT NULL,
  `description_ko` text NOT NULL,
  `description_ja` text NOT NULL,
  `description_zh` text NOT NULL,
  `requires_reservation` integer DEFAULT false NOT NULL,
  `min_age` integer,
  `safety_note_ko` text NOT NULL,
  `active` integer DEFAULT true NOT NULL,
  FOREIGN KEY (`place_id`) REFERENCES `places`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `condition_snapshots` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `place_id` text NOT NULL,
  `observed_at` text NOT NULL,
  `temperature` real NOT NULL,
  `precipitation` real NOT NULL,
  `wind_speed` real NOT NULL,
  `wave_height` real NOT NULL,
  `water_temperature` real NOT NULL,
  `source` text NOT NULL,
  FOREIGN KEY (`place_id`) REFERENCES `places`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_places_active_kind` ON `places` (`active`,`activity_kind`);
--> statement-breakpoint
CREATE INDEX `idx_activities_place_active` ON `activities` (`place_id`,`active`);
--> statement-breakpoint
CREATE INDEX `idx_snapshots_place_time` ON `condition_snapshots` (`place_id`,`observed_at`);
--> statement-breakpoint
PRAGMA optimize;
