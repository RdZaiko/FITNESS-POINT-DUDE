"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="simple-message"><div><span className="eyebrow"><span/>A SMALL SETBACK</span><h1>Take a breath.<br/><em>Then try again.</em></h1><button className="button button-lime" onClick={() => reset()}>Reload this page ↻</button></div></main>;
}
