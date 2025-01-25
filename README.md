# Example Ponder Fullstack API

This example shows how to build a fullstack backend using Ponder with support for offchain database tables and background tasks. It builds on Ponder's [ERC721 indexing example](https://github.com/ponder-sh/ponder/tree/main/examples/reference-erc721) which uses the Smol Brains NFT contract on Arbitrum ([Link](https://arbiscan.io/address/0x6325439389E0797Ab35752B4F43a14C004f22A9c)).

## Quirks

By default Ponder doesn't export CommonJS but Drizzle Kit can't be run in ESM mode (as explained in [this longstanding issue](https://github.com/drizzle-team/drizzle-orm/issues/819#issuecomment-1927814518)). As a sketchy workaround, this example [patches](https://github.com/jaydenwindle/ponder-fullstack/blob/070a1fa68bc26019b76970427c3201b4bf06df9d/patches/ponder.patch) Ponder to export it's ESM bundle as a CommonJS bundle like so. Since the CommonJS import is only used inside Drizzle Kit commands this seems to work fine.

It is also important that the `drizzle-orm` version installed is the same as the one used by Ponder (otherwise you will run into type issues).

