CREATE TABLE `media` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`path` text NOT NULL,
	`alt` text DEFAULT '' NOT NULL,
	`type` text DEFAULT 'image' NOT NULL,
	`width` integer,
	`height` integer,
	`source_name` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `media_path_unique` ON `media` (`path`);