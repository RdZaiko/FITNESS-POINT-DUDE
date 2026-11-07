import "server-only";
import Mux from "@mux/ts";

export function getMux() {
  const tokenId = process.env.MUX_TOKEN_ID;
  const tokenSecret = process.env.MUX_TOKEN_SECRET;
  if (!tokenId || !tokenSecret) return null;
  return new Mux({ tokenId, tokenSecret });
}
