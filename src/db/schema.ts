import { relations } from 'drizzle-orm';

import { token, account, transferEvent } from "ponder:schema"
import { metadata } from "./offchain.schema"

export const tokenRelations = relations(token, ({ one }) => ({
  metadata: one(metadata, {
    fields: [token.id],
    references: [metadata.tokenId],
  }),
}));

export {
  token, account, transferEvent, metadata
}
