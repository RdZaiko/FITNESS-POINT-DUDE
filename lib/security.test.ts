import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { validMuxSignature } from "./mux-webhook";
import { canIssuePlayback } from "./playback-access";

describe("Mux webhook signature verification",()=>{
  const secret="test-webhook-secret";
  const raw="{\"type\":\"video.asset.ready\",\"data\":{\"id\":\"asset_123\"}}";
  const timestamp=1_800_000_000;
  const digest=createHmac("sha256",secret).update(`${timestamp}.${raw}`).digest("hex");
  const header=`t=${timestamp},v1=${digest}`;
  it("accepts a valid signature on the raw body",()=>expect(validMuxSignature(raw,header,secret,timestamp)).toBe(true));
  it("rejects a changed body or secret",()=>{
    expect(validMuxSignature(`${raw} `,header,secret,timestamp)).toBe(false);
    expect(validMuxSignature(raw,header,"wrong-secret",timestamp)).toBe(false);
  });
  it("rejects signatures older than the allowed clock window",()=>expect(validMuxSignature(raw,header,secret,timestamp+301)).toBe(false));
});

describe("private playback gate",()=>{
  const allowed={authenticated:true,demo:false,visibleByRowPolicy:true,status:"ready",playbackId:"signed-playback-id"};
  it("allows a visible, ready, signed asset for an authenticated account",()=>expect(canIssuePlayback(allowed)).toBe(true));
  it("blocks unauthenticated and demo users",()=>{
    expect(canIssuePlayback({...allowed,authenticated:false})).toBe(false);
    expect(canIssuePlayback({...allowed,demo:true})).toBe(false);
  });
  it("blocks unavailable, unready, and unsigned assets",()=>{
    expect(canIssuePlayback({...allowed,visibleByRowPolicy:false})).toBe(false);
    expect(canIssuePlayback({...allowed,status:"processing"})).toBe(false);
    expect(canIssuePlayback({...allowed,playbackId:null})).toBe(false);
  });
  it("permits an active signed live stream for an authorized account",()=>expect(canIssuePlayback({...allowed,status:"live"})).toBe(true));
  it("permits a completed signed recording for an authorized account",()=>expect(canIssuePlayback({...allowed,status:"completed"})).toBe(true));
});
