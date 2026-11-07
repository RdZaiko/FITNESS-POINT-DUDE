import Image from "next/image";
import {
  ArrowDown, ArrowRight, ArrowUpRight, Award, Bike, Check, Clock3,
  Dumbbell, HeartPulse, Mail, MapPin, MessageCircle, MoveUpRight, Phone,
  ShieldCheck, Sparkles, UserRound, Users, Weight, Zap,
} from "lucide-react";
import { gym, whatsappHref, whatsappMessages } from "@/lib/gym-config";
import { GymNav } from "@/components/gym-nav";
import { GymGallery } from "@/components/gym-gallery";
import { FloatingContact } from "@/components/floating-contact";
import { GymEnquiryForm } from "@/components/gym-enquiry-form";
import { Reveal } from "@/components/gym-reveal";

const photo = (id: string, width = 1000) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`;
const nav = [["About", "about"], ["Facilities", "facilities"], ["Programs", "programs"], ["Trainers", "trainers"], ["Plans", "membership"], ["Contact", "contact"]];
const facilityIcons = [HeartPulse, Weight, Dumbbell, Zap, UserRound, MoveUpRight, Dumbbell, ShieldCheck, Check, Sparkles];
const programIcons = [HeartPulse, Dumbbell, Weight, Zap, Bike, UserRound, Sparkles, ArrowRight, Award, Users];
function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow"><span />{children}</div>;
}

function CallLink({ children, className = "button button-red" }: { children: React.ReactNode; className?: string }) {
  return <a className={className} href={`tel:${gym.phone}`}><Phone size={16} />{children}</a>;
}

function WhatsAppLink({ message = whatsappMessages.general, children, className = "button button-outline" }: { message?: string; children: React.ReactNode; className?: string }) {
  return <a className={className} href={whatsappHref(message)} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} />{children}</a>;
}

function Brand() {
  return <a href="#home" className="brand" aria-label={`${gym.name} home`}>
    <span className="brand-mark"><Image src={gym.logoUrl} width={42} height={42} alt="" /></span>
    <span>{gym.name}<small>{gym.tagline}</small></span>
  </a>;
}

export default function Home() {
  return <main>
    <GymNav />

    <section className="hero" id="home" style={{ backgroundImage: `linear-gradient(90deg,rgba(7,7,7,.94) 0%,rgba(7,7,7,.76) 44%,rgba(7,7,7,.16) 100%),linear-gradient(0deg,#080808 0%,transparent 28%),url('${photo("photo-1534438327276-14e5300c3a48",2200)}')` }}>
      <div className="hero-grain" />
      <div className="hero-content">
        <div className="hero-intro"><Eyebrow>FITNESS POINT DUDE · NEW DELHI</Eyebrow></div>
        <h1 className="hero-headline">TRANSFORM<br /><em>YOUR BODY,</em><br />YOUR LIFE<span className="period">.</span></h1>
        <p className="hero-subtitle">{gym.tagline}</p>
        <div className="hero-actions hero-entrance">
          <WhatsAppLink message={whatsappMessages.freeTrial}>Enquire about a free trial <ArrowUpRight size={15} /></WhatsAppLink>
          <a href="#membership" className="button button-ghost">View plans <ArrowDown size={15} /></a>
          <a href="#trainers" className="button button-ghost">Meet our trainers <ArrowDown size={15} /></a>
        </div>
        <p className="hero-image-note">Hero background is illustrative stock photography, not a photo of the gym.</p>
        <p className="confirmation-note">Free trial availability is not confirmed. Message the gym to ask.</p>
      </div>
      <div className="hero-index"><span>01</span><i /><span>FITNESS POINT DUDE</span></div>
      <a className="hero-scroll" href="#about">SCROLL TO EXPLORE <ArrowDown size={14} /></a>
    </section>

    <div className="ticker" aria-hidden="true"><div>{[0, 1, 2, 3].map((i) => <span key={i}>DISCIPLINE <b>✳</b> STRENGTH <b>✳</b> PROGRESS <b>✳</b> EVERY DAY <b>✳</b></span>)}</div></div>

    <section className="section about-section" id="about"><div className="container about-grid">
      <Reveal className="about-visual"><Image unoptimized width={1000} height={1200} sizes="(max-width: 760px) 100vw, 50vw" src={photo("photo-1517836357463-d25dfeac3438")} alt="Illustrative fitness training photograph" loading="lazy" /><div className="image-stamp"><span>ILLUSTRATIVE PHOTO</span><b>FITNESS / 01</b></div><div className="about-mini"><Dumbbell /><span>TRAIN WITH<br /><b>YOUR GOALS IN MIND</b></span></div></Reveal>
      <Reveal className="about-copy" delay={.1}><Eyebrow>ABOUT FITNESS POINT DUDE</Eyebrow><h2>A PLACE TO<br /><em>MOVE FORWARD.</em></h2><p className="lead">{gym.description}</p><div className="about-points"><div><b>01</b><span><strong>Work toward your goal</strong><small>Weight loss, strength, muscle building, or general fitness.</small></span></div><div><b>02</b><span><strong>Find your next step</strong><small>Ask the team about guidance and training options.</small></span></div></div><a href="#facilities" className="text-link">Explore facilities <ArrowRight size={16} /></a></Reveal>
    </div></section>

    <section className="why-band" id="why-choose-us"><div className="container why-grid"><Reveal className="why-heading"><Eyebrow>WHY CHOOSE US</Eyebrow><h2>YOUR GOAL.<br /><em>YOUR JOURNEY.</em></h2><p>A motivating environment and professional fitness guidance, with room to work at your own pace.</p><a href="#contact" className="button button-red">Talk with the team <ArrowRight size={16} /></a></Reveal><div className="reasons-grid">
      {[[Dumbbell, "Fitness goals", "Work toward weight loss, muscle building, strength, or general fitness."], [Users, "Motivating environment", "A modern fitness destination to keep your routine moving."], [Award, "Professional guidance", "Ask the team about fitness guidance for your goals."], [HeartPulse, "Start where you are", "Discuss a fitness approach that suits your experience and aims."]].map(([Icon, title, description], i) => { const ItemIcon = Icon as typeof Dumbbell; return <Reveal key={String(title)} delay={i * .07}><article className="reason"><span><ItemIcon size={20} /></span><div><h3>{String(title)}</h3><p>{String(description)}</p></div></article></Reveal>; })}
    </div></div></section>

    <section className="section facilities-section" id="facilities"><div className="container"><Reveal className="section-top"><div><Eyebrow>GYM FACILITIES</Eyebrow><h2>SPACE TO<br /><em>BUILD YOURSELF.</em></h2></div><p>Explore the facilities available for your training sessions.</p></Reveal><p className="owner-confirmation"><ShieldCheck size={16} /> {gym.facilitiesStatus}</p><div className="facility-grid facility-grid-clean">{gym.facilities.map((facility, i) => { const Icon = facilityIcons[i]; return <Reveal key={facility.name} delay={(i % 5) * .04}><article className="facility-card facility-card-clean"><span className="facility-symbol"><Icon size={23} /></span><span className="card-number">{String(i + 1).padStart(2, "0")}</span><h3>{facility.name}</h3><p>{facility.description}</p><span className="confirmed-tag">Confirmed</span></article></Reveal>; })}</div></div></section>

    <section className="section programs-section" id="programs"><div className="container"><Reveal className="section-top"><div><Eyebrow>FITNESS PROGRAMS</Eyebrow><h2>TRAIN FOR<br /><em>WHAT MATTERS.</em></h2></div><p>Explore a training focus and ask the team about current options.</p></Reveal><div className="program-grid program-grid-clean">{gym.programs.map((program, i) => { const Icon = programIcons[i]; return <Reveal key={program.name} delay={(i % 5) * .04}><article className="program-card program-card-clean"><span className="program-icon"><Icon size={21} /></span><span className="program-number">{String(i + 1).padStart(2, "0")}</span><h3>{program.name}</h3><p>{program.description}</p><a href={whatsappHref(whatsappMessages.program(program.name))} target="_self" className="text-link">Ask about this program <ArrowUpRight size={15} /></a></article></Reveal>; })}</div></div></section>

    <section className="membership-section" id="membership"><div className="container membership-wrap"><Reveal className="membership-heading"><Eyebrow>MEMBERSHIP PLANS</Eyebrow><h2>MAKE TIME<br />FOR <em>YOURSELF.</em></h2><p>Choose the membership duration that fits your goals. All listed plan prices are confirmed.</p><p className="owner-confirmation"><ShieldCheck size={16} /> {gym.pricingStatus}</p><WhatsAppLink message={whatsappMessages.membership}>Membership enquiry</WhatsAppLink></Reveal><div className="plan-grid">{gym.membershipPlans.map((plan, i) => <Reveal key={plan.id} delay={i * .06}><article className={`plan-card ${i === 1 ? "plan-featured" : ""}`}><span className="plan-index">0{i + 1} / PLAN</span><h3>{plan.name}</h3><div className="plan-price"><small>₹</small>{plan.price.toLocaleString("en-IN")}</div><span className="plan-duration">{plan.duration}</span><p>{plan.description}</p><a className="button button-red plan-link" href={whatsappHref(whatsappMessages.plan(plan.name))} target="_blank" rel="noopener noreferrer">Join Now <ArrowUpRight size={15} /></a></article></Reveal>)}</div></div></section>

    <section className="section trainers-section" id="trainers"><div className="container"><Reveal className="section-top"><div><Eyebrow>MEET THE TRAINERS</Eyebrow><h2>GOOD GUIDANCE.<br /><em>REAL COMMITMENT.</em></h2></div><p>Meet the trainers shared by Fitness Point Dude.</p></Reveal><div className="trainer-grid trainer-grid-premium">{gym.trainers.map((coach, i) => <Reveal key={coach.name} delay={i * .1}><article className="trainer-card trainer-card-premium"><div className="trainer-image trainer-stock"><Image unoptimized width={1000} height={1000} sizes="(max-width: 760px) 100vw, 44vw" src={photo(coach.photo, 1000)} alt={`Representative stock gym image for ${coach.name}'s trainer profile; not a photograph of ${coach.name}`} loading="lazy" /><span>REPRESENTATIVE STOCK · NOT {coach.name.toUpperCase()}</span><b>0{i + 1}</b></div><div className="trainer-details"><div><h3>{coach.name}</h3><p>Trainer · {coach.age}</p></div><ArrowUpRight size={18} /></div><div className="trainer-meta"><span><Award size={15} />{coach.achievement}</span><span><Clock3 size={15} />{coach.experience} experience</span><ul>{coach.specializations.map((specialization) => <li key={specialization}>{specialization}</li>)}</ul></div></article></Reveal>)}</div><p className="placeholder-note">These are representative stock images and do not depict Prince or Ajay. Please supply actual trainer photos to replace them.</p></div></section>

    <GymGallery />

    <section className="testimonial-section" id="testimonials"><div className="container testimonial-inner"><Reveal><Eyebrow>MEMBER STORIES</Eyebrow><h2>YOUR PROGRESS<br />IS <em>PERSONAL.</em></h2><p>Member reviews will be added when genuine stories are available. Have questions? Talk directly with the team about your goals.</p><WhatsAppLink message={whatsappMessages.general}>Talk with the team <ArrowRight size={16} /></WhatsAppLink></Reveal><Reveal className="testimonial-image"><Image unoptimized width={1000} height={700} sizes="(max-width: 760px) 100vw, 50vw" src={photo("photo-1518611012118-696072aa579a", 1000)} alt="Illustrative fitness training photograph" loading="lazy" /><div><span>ILLUSTRATIVE PHOTO</span><b>YOUR STORY STARTS HERE.</b></div></Reveal></div></section>

    <section className="section faq-section" id="faq"><div className="container faq-grid"><Reveal><Eyebrow>FREQUENTLY ASKED QUESTIONS</Eyebrow><h2>GOOD TO<br /><em>KNOW.</em></h2><p>Need a specific answer? Send the gym a message.</p><WhatsAppLink message={whatsappMessages.general}>Ask a question</WhatsAppLink></Reveal><div className="faq-list">{[
      ["How do I ask about membership?", "Use the membership enquiry link or complete the form below. It opens WhatsApp with a message ready for you to send."],
      ["Can I book a free trial?", `Free trial availability is ${gym.freeTrialStatus.toLowerCase()}. Send an enquiry to ask the gym.`],
      ["Are the membership prices confirmed?", "Yes. The membership plan prices shown on this page are confirmed."],
      ["Are the opening hours confirmed?", "Yes. The gym is open all seven days with no weekly off. See the schedule above for daily timings."],
      ["Are all listed facilities available?", "The facilities are a suggested list. Please contact the gym to confirm availability."],
    ].map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></div></section>

    <section className="hours-section" id="hours"><div className="container hours-inner"><Reveal><Eyebrow>OPENING HOURS</Eyebrow><h2>FIND YOUR<br /><em>TIME TO TRAIN.</em></h2><p className="owner-confirmation"><ShieldCheck size={16} /> {gym.openingHoursStatus}</p></Reveal><Reveal className="hours-card"><div className="hours-list">{gym.openingHours.map((hours) => <div key={hours.days}><span>{hours.days}</span><b>{hours.time}</b></div>)}</div><div className="hours-foot"><span>Weekly off</span><b>{gym.weeklyOff}</b></div></Reveal></div></section>

    <section className="location-section" id="location"><div className="container location-grid"><Reveal className="location-copy"><Eyebrow>GYM LOCATION</Eyebrow><h2>YOUR NEXT<br /><em>TRAINING SPOT.</em></h2><p>Find Fitness Point Dude in Shahbad Dairy, New Delhi.</p><a className="address-link" href={gym.directionsUrl} target="_blank" rel="noopener noreferrer"><MapPin size={18} />{gym.addressLines.map((line) => <span key={line}>{line}</span>)}<ArrowUpRight size={16} /></a><a className="button button-red directions-button" href={gym.directionsUrl} target="_blank" rel="noopener noreferrer">Get Directions <ArrowUpRight size={16} /></a></Reveal><Reveal className="map-frame"><iframe src={gym.mapEmbedUrl} title="Google Maps search for Fitness Point Dude, Shahbad Dairy, New Delhi" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /><a href={gym.directionsUrl} target="_blank" rel="noopener noreferrer" className="map-label"><MapPin size={16} /><span><b>FITNESS POINT DUDE</b><small>Open directions in Google Maps</small></span><ArrowUpRight size={17} /></a></Reveal></div></section>

    <section className="contact-section" id="contact"><div className="contact-glow" /><div className="container contact-inner"><Reveal className="contact-intro"><Eyebrow>CONTACT THE GYM</Eyebrow><h2>READY TO<br /><em>GET STARTED?</em></h2><p>Call, email, or message Fitness Point Dude. The team can help you explore your options.</p><div className="contact-actions"><CallLink>Call now</CallLink><WhatsAppLink>WhatsApp enquiry</WhatsAppLink></div><div className="contact-alt"><span>Alternate number</span><a href={`tel:${gym.alternatePhone}`}><Phone size={15} />{gym.alternatePhoneDisplay}</a></div></Reveal><Reveal className="contact-card"><a className="contact-row" href={`tel:${gym.phone}`}><span><Phone /></span><div><small>CALL THE GYM</small><b>{gym.phoneDisplay}</b></div><ArrowUpRight /></a><a className="contact-row" href={whatsappHref(whatsappMessages.general)} target="_blank" rel="noopener noreferrer"><span><MessageCircle /></span><div><small>WHATSAPP</small><b>{gym.phoneDisplay}</b></div><ArrowUpRight /></a><a className="contact-row" href={`mailto:${gym.email}`}><span><Mail /></span><div><small>EMAIL</small><b>{gym.email}</b></div><ArrowUpRight /></a><a className="contact-row" href={gym.directionsUrl} target="_blank" rel="noopener noreferrer"><span><MapPin /></span><div><small>VISIT US</small><b>{gym.addressLines.slice(1).join(", ")}</b></div><ArrowUpRight /></a><a className="youtube-link" href={gym.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="Visit the supplied Fitness Point Dude YouTube link"><span className="youtube-play">▶</span> Follow on YouTube <ArrowUpRight size={14} /></a></Reveal></div></section>

    <section className="enquiry-section" id="enquiry"><div className="container enquiry-grid"><Reveal><Eyebrow>MEMBERSHIP & FREE TRIAL ENQUIRY</Eyebrow><h2>LET’S START<br /><em>A CONVERSATION.</em></h2><p>Share a few details. We’ll prepare a WhatsApp message for you to review and send.</p><p className="confirmation-note">A free trial is not confirmed; use the form to ask about availability.</p></Reveal><Reveal className="form-panel"><GymEnquiryForm /></Reveal></div></section>

    <footer className="footer"><div className="container footer-top"><Brand /><p>{gym.tagline}</p><nav className="footer-links" aria-label="Footer navigation">{nav.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}<a href="#gallery">Gallery</a><a href="#faq">FAQ</a><a href="#hours">Hours</a></nav><div className="footer-actions"><CallLink className="footer-call">Call {gym.phoneDisplay}</CallLink><a href={`tel:${gym.alternatePhone}`} className="footer-detail-link">Alternate: {gym.alternatePhoneDisplay}</a><a href={`mailto:${gym.email}`} className="footer-detail-link">{gym.email}</a><a href={gym.social.youtube} target="_blank" rel="noopener noreferrer" className="footer-detail-link">YouTube <ArrowUpRight size={13} /></a></div><div className="footer-details"><a href={gym.directionsUrl} target="_blank" rel="noopener noreferrer"><MapPin size={14} />{gym.addressLines.join(", ")}</a><a href="#hours"><Clock3 size={14} />Confirmed hours · open all 7 days</a></div></div><div className="container footer-bottom"><span>© 2026 {gym.name}. All rights reserved.</span><a className="back-to-top" href="#home">Back to top <ArrowUpRight size={14} /></a><span>TRAIN WITH PURPOSE <b>✳</b></span></div></footer>

    <FloatingContact />
  </main>;
}
