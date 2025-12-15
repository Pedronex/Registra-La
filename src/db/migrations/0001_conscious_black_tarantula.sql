PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_config` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tolerance` integer,
	`work_days` text DEFAULT '[]',
	`work_hours` integer NOT NULL,
	`company_name` text,
	`initial_balance` integer DEFAULT 0,
	`entrace_time` integer NOT NULL,
	`exit_time` integer NOT NULL,
	`entrace_buffer_time` integer DEFAULT 0,
	`exit_buffer_time` integer DEFAULT 0,
	`created_at` integer DEFAULT '"2025-12-09T12:03:07.719Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-12-09T12:03:07.719Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_config`("id", "tolerance", "work_days", "work_hours", "company_name", "initial_balance", "entrace_time", "exit_time", "entrace_buffer_time", "exit_buffer_time", "created_at", "updated_at") SELECT "id", "tolerance", "work_days", "work_hours", "company_name", "initial_balance", "entrace_time", "exit_time", "entrace_buffer_time", "exit_buffer_time", "created_at", "updated_at" FROM `config`;--> statement-breakpoint
DROP TABLE `config`;--> statement-breakpoint
ALTER TABLE `__new_config` RENAME TO `config`;--> statement-breakpoint
PRAGMA foreign_keys=ON;