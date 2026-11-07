export type PlaybackAccessInput={authenticated:boolean;demo:boolean;visibleByRowPolicy:boolean;status:"ready"|"live"|string;playbackId:string|null};

/** The row-policy query must already have succeeded; this adds the app-level readiness gate. */
export function canIssuePlayback(input:PlaybackAccessInput){
  return input.authenticated&&!input.demo&&input.visibleByRowPolicy&&Boolean(input.playbackId)&&
    (input.status==="ready"||input.status==="live"||input.status==="completed");
}
