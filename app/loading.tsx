import { Dumbbell } from "lucide-react";

export default function Loading() {
  return <main className="loading-page" aria-busy="true" aria-live="polite"><div><span className="loading-mark"><Dumbbell size={22}/></span><b>FITNESS POINT DUDE</b><span className="loading-line"/><small>GETTING THE GYM READY</small></div></main>;
}
