import { ponder } from "ponder:registry";
import { graphql } from "ponder";
import { eq } from "drizzle-orm"

import { db } from "../db"
import { metadata, token } from "../db/schema"

ponder.use("/", graphql());
ponder.use("/graphql", graphql());

ponder.get("/token/:tokenId", async (c) => {
  const tokenId = c.req.param("tokenId");

  const tokenData = await db.query.token.findFirst({
    where: eq(token.id, BigInt(tokenId)),
    with: {
      metadata: true
    }
  })

  if (!tokenData) {
    return c.json({ error: "Not found" }, 400)
  }


  return c.json({
    id: Number(tokenData.id),
    owner: tokenData.owner,
    metadata: tokenData?.metadata.metadata
  });
});

ponder.get("/metadata/:tokenId", async (c) => {
  const tokenId = c.req.param("tokenId");

  const tokenMetadata = await db.query.metadata.findFirst({
    where: eq(metadata.tokenId, BigInt(tokenId))
  })

  return c.json(tokenMetadata?.metadata || {});
});
