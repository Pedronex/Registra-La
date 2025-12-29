CREATE TABLE `config` (
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
	`notifications` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT '"2025-12-15T20:48:41.183Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-12-15T20:48:41.183Z"' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `registers` (
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
