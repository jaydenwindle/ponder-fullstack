import { pgSchema, json } from "drizzle-orm/pg-core";
import { bigint } from "ponder"

export const offchainSchema = pgSchema("offchain");

export const metadata = offchainSchema.table("metadata", {
  tokenId: bigint().primaryKey(),
  metadata: json(),
});
