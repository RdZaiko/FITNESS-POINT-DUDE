import Link from "next/link";

export default function NotFound() {
  return <main className="simple-message"><div><span className="eyebrow"><span/>404 / WRONG TURN</span><h1>Let’s get back<br/><em>to the good stuff.</em></h1><Link href="/" className="button button-lime">Back to the gym <span aria-hidden="true">↗</span></Link></div></main>;
}
