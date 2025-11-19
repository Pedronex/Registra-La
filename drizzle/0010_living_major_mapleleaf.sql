PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_config` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`work_hours` integer NOT NULL,
	`tolerance` integer,
	`break_time` integer,
	`work_days` text,
	`company_name` text,
	`gemini_api_key` text,
	`initial_balance` real DEFAULT 0,
	`created_at` integer DEFAULT '"2025-10-31T12:32:26.899Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-10-31T12:32:26.899Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_config`("id", "work_hours", "tolerance", "break_time", "work_days", "company_name", "gemini_api_key", "initial_balance", "created_at", "updated_at") SELECT "id", "work_hours", "tolerance", "break_time", "work_days", "company_name", "gemini_api_key", "initial_balance", "created_at", "updated_at" FROM `config`;--> statement-breakpoint
DROP TABLE `config`;--> statement-breakpoint
ALTER TABLE `__new_config` RENAME TO `config`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_registers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`time` integer DEFAULT 0 NOT NULL,
	`date` text NOT NULL,
	`is_full_day` integer DEFAULT false NOT NULL,
	`photo` text,
	`location` text,
	`description` text,
	`nsr` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_registers`("id", "type", "time", "date", "is_full_day", "photo", "location", "description", "nsr", "created_at", "updated_at") SELECT "id", "type", "time", "date", "is_full_day", "photo", "location", "description", "nsr", "created_at", "updated_at" FROM `registers`;--> statement-breakpoint
DROP TABLE `registers`;--> statement-breakpoint
ALTER TABLE `__new_registers` RENAME TO `registers`;