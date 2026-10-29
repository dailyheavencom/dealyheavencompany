CREATE TABLE "demo_state" (
	"session_id" text,
	"key" text,
	"value" jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "demo_state_pkey" PRIMARY KEY("session_id","key")
);
