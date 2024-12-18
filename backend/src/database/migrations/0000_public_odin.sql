-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "tournaments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"status" varchar(50) NOT NULL,
	"location" varchar(50) NOT NULL,
	"date" date NOT NULL,
	"participant_count" smallint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brackets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"status" varchar(50) NOT NULL,
	"participant_count" smallint NOT NULL,
	"tournament_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "brackets" ADD CONSTRAINT "brackets_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;
*/