PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_registers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`time` text NOT NULL,
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
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_registers`("id", "type", "time", "date", "is_full_day", "photo", "location", "description", "nsr", "start_time", "end_time", "duration", "operation", "created_at", "updated_at") SELECT "id", "type", "time", "date", "is_full_day", "photo", "location", "description", "nsr", "start_time", "end_time", "duration", "operation", "created_at", "updated_at" FROM `registers`;--> statement-breakpoint
DROP TABLE `registers`;--> statement-breakpoint
ALTER TABLE `__new_registers` RENAME TO `registers`;--> statement-breakpoint
PRAGMA foreign_keys=ON;