PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_config` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`work_hours` integer NOT NULL,
	`tolerance` integer,
	`break_time` integer,
	`work_days` text,
	`company_name` text,
	`gemini_api_key` text,
	`initial_balance` integer DEFAULT 0,
	`created_at` integer DEFAULT '"2025-10-31T13:11:22.996Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-10-31T13:11:22.996Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_config`("id", "work_hours", "tolerance", "break_time", "work_days", "company_name", "gemini_api_key", "initial_balance", "created_at", "updated_at") SELECT "id", "work_hours", "tolerance", "break_time", "work_days", "company_name", "gemini_api_key", "initial_balance", "created_at", "updated_at" FROM `config`;--> statement-breakpoint
DROP TABLE `config`;--> statement-breakpoint
ALTER TABLE `__new_config` RENAME TO `config`;--> statement-breakpoint
PRAGMA foreign_keys=ON;