"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { gym, whatsappHref } from "@/lib/gym-config";

export function GymEnquiryForm() {
  const [status, setStatus] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const plan = String(data.get("plan") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const normalizedPhone = phone.replace(/[()\s.-]/g, "");

    if (!name || !phone || !plan || !message) {
      setStatus("Please complete all fields before continuing.");
      return;
    }
    if (!/^\+?\d{7,15}$/.test(normalizedPhone)) {
      setStatus("Enter a valid phone number with 7 to 15 digits.");
      return;
    }

    const enquiry = [
      "Hello Fitness Point Dude! I would like to make an enquiry.",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Interested in: ${plan}`,
      `Message: ${message}`,
    ].join("\n");
    const popup = window.open(whatsappHref(enquiry), "_blank");
    if (popup) popup.opener = null;
    setStatus(popup
      ? "Your enquiry is ready in WhatsApp. Tap Send there to reach the gym."
      : "WhatsApp could not open. Use the WhatsApp enquiry link above to continue.");
    if (popup) form.reset();
  }

  return <form className="enquiry-form" onSubmit={submit} noValidate>
    <label>Name<input name="name" autoComplete="name" required placeholder="Your name" /></label>
    <label>Phone number<input name="phone" type="tel" autoComplete="tel" inputMode="tel" required placeholder="Your phone number" /></label>
    <label>Interested membership plan<select name="plan" required defaultValue=""><option value="" disabled>Select a plan or enquiry</option>{gym.membershipPlans.map((plan) => <option key={plan.id} value={plan.name}>{plan.name}</option>)}<option value="Free trial enquiry">Free trial enquiry</option><option value="General fitness enquiry">General fitness enquiry</option></select></label>
    <label>Message<textarea name="message" rows={4} required placeholder="Tell us what you would like to know" /></label>
    <button className="button button-red" type="submit"><MessageCircle size={17} /> Continue in WhatsApp <ArrowUpRight size={15} /></button>
    <p className="form-status" role="status" aria-live="polite">{status}</p>
  </form>;
}
