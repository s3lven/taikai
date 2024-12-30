CREATE TABLE "participants" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"sequence" smallint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "participants_bracket" (
	"participant_id" integer NOT NULL,
	"bracket_id" integer NOT NULL,
	CONSTRAINT "participants_bracket_pkey" PRIMARY KEY("participant_id","bracket_id")
);
--> statement-breakpoint
ALTER TABLE "brackets" ALTER COLUMN "status" SET DEFAULT 'Editing';--> statement-breakpoint
ALTER TABLE "brackets" ALTER COLUMN "participant_count" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "brackets" ADD COLUMN "progress" smallint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "brackets" ADD COLUMN "type" varchar(50) DEFAULT 'Single Elimination' NOT NULL;--> statement-breakpoint
ALTER TABLE "participants_bracket" ADD CONSTRAINT "participants_bracket_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participants_bracket" ADD CONSTRAINT "participants_bracket_bracket_id_fkey" FOREIGN KEY ("bracket_id") REFERENCES "public"."brackets"("id") ON DELETE cascade ON UPDATE no action;