import { Queue } from 'bullmq';
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { createPublicClient, http } from 'viem'
import { arbitrum } from 'viem/chains'

import config from "../../ponder.config"
import { db } from "../db"
import { metadata as metadataTable } from "../db/offchain.schema"

const publicClient = createPublicClient({
  chain: arbitrum,
  transport: http(process.env.PONDER_RPC_URL_42161!)
})

export const queue = new Queue('queue');

const connection = new IORedis({ maxRetriesPerRequest: null });

export const worker = new Worker(
  'queue',
  async job => {
    const { tokenId } = job.data;
    const { ERC721 } = config.contracts

    const tokenUri = await publicClient.readContract({
      abi: ERC721.abi,
      address: ERC721.address,
      functionName: "tokenURI",
      args: [tokenId]
    })

    const normalizedTokenUri = tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/")

    const metadata = await fetch(normalizedTokenUri).then(res => res.json())

    // insert data into offchain db that persists between indexing runs
    await db.insert(metadataTable).values({
      tokenId,
      metadata
    }).onConflictDoNothing()
  },
  {
    connection,
    concurrency: 10,
    limiter: {
      max: 10,
      duration: 1000,
    },
  },
);

worker.on('completed', async job => {
  const counts = await queue.getJobCounts('wait')
  console.log(`${job.id} has completed!`);
  console.log(`jobs left: ${counts.wait}`);
});

worker.on('failed', (job, err) => {
  console.log(`${job?.id || "unknown job"} has failed with ${err.message}`);
});
