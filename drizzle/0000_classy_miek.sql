CREATE TABLE `config` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`work_hours` integer NOT NULL,
	`tolerance` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `registers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`time` text,
	`date` text NOT NULL,
	`is_full_day` integer DEFAULT false NOT NULL,
	`photo` text,
	`location` text,
	`description` text,
	`nsr` text,
	`start_time` text,
	`end_time` text,
	`duration` integer,
	`operation` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
