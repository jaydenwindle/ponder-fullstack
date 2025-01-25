CREATE SCHEMA "offchain";
--> statement-breakpoint
CREATE TABLE "offchain"."metadata" (
	"tokenId" numeric(78) PRIMARY KEY NOT NULL,
	"metadata" json
);
