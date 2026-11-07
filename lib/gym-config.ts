/**
 * Central client configuration for FITNESS POINT DUDE.
 * Hours, prices, and facilities are client-supplied suggestions and require
 * owner approval before publication. Keep this file as the single edit point.
 */
export const gym = {
  name: "FITNESS POINT DUDE",
  tagline: "Transform Your Body, Transform Your Life.",
  description:
    "Fitness Point Dude is a modern fitness destination dedicated to helping people achieve their fitness goals. Whether you want to lose weight, build muscle, increase strength, or improve your overall fitness, we provide a motivating environment and professional fitness guidance to help you transform your body.",
  brandColors: { background: "#080808", text: "#FFFFFF", accent: "#E50914" },
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  logoUrl: "/fitness-mark.svg", // Existing project gym mark; replace with the official logo if supplied.
  phone: "+918851320897",
  phoneDisplay: "+91 8851320897",
  alternatePhone: "+917982467191",
  alternatePhoneDisplay: "+91 79824 67191",
  whatsappNumber: "918851320897",
  whatsappUrl: "https://wa.me/918851320897",
  whatsappQrFallback: "https://wa.me/qr/PHZY35XJHRZND1",
  email: "tp995386@gmail.com",
  address: "FITNESS POINT DUDE, D-4/37, Shahbad Dairy, Near Hanuman Mandir, New Delhi, Delhi - 110042, India.",
  addressLines: [
    "FITNESS POINT DUDE",
    "D-4/37, Shahbad Dairy",
    "Near Hanuman Mandir",
    "New Delhi, Delhi - 110042, India",
  ],
  directionsUrl: "https://goo.gl/maps/RNS1ZDiQMZiDDwBm6?g_st=ac",
  // Address search embed; relies on the full client-supplied address and invents no coordinates.
  mapEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent("FITNESS POINT DUDE, D-4/37, Shahbad Dairy, Near Hanuman Mandir, New Delhi, Delhi - 110042, India")}&output=embed`,
  openingHoursStatus: "Confirmed opening hours",
  openingHours: [
    { days: "Monday–Saturday", time: "5:00 AM – 10:00 PM" },
    { days: "Sunday", time: "6:00 AM – 12:00 PM" },
  ],
  weeklyOff: "No weekly off — open all 7 days",
  pricingStatus: "Confirmed membership prices",
  freeTrialStatus: "Not confirmed",
  membershipPlans: [
    { id: "1-month", name: "1 Month", duration: "1 month", price: 999, description: "A one-month membership option." },
    { id: "3-month", name: "3 Months", duration: "3 months", price: 2499, description: "A three-month membership option." },
    { id: "6-month", name: "6 Months", duration: "6 months", price: 4499, description: "A six-month membership option." },
    { id: "12-month", name: "12 Months", duration: "12 months", price: 7999, description: "A twelve-month membership option." },
  ],
  // All existing facilities are approved and confirmed by the gym owner.
  facilitiesStatus: "All 10 facilities confirmed by the gym owner",
  facilities: [
    { name: "Cardio Equipment", description: "Cardio equipment for endurance-focused sessions." },
    { name: "Weight Training Equipment", description: "Equipment for structured resistance training." },
    { name: "Dumbbells and Barbells", description: "Free weights for a range of strength exercises." },
    { name: "Strength Training Machines", description: "Machine-based options for strength work." },
    { name: "Personal Training", description: "One-to-one coaching, subject to availability." },
    { name: "Functional Training", description: "Movement-focused training for everyday strength." },
    { name: "Free Weight Training", description: "Space for free-weight exercise and practice." },
    { name: "Fitness Assessment", description: "An opportunity to discuss starting points and goals." },
    { name: "Workout Guidance", description: "Guidance to help plan a workout routine." },
    { name: "Body Transformation Guidance", description: "Support for working toward personal fitness goals." },
  ],
  programs: [
    { name: "Weight Loss Program", description: "Training ideas for a weight-loss goal." },
    { name: "Muscle Building Program", description: "Resistance training focused on muscle building." },
    { name: "Strength Training", description: "Build strength through progressive training." },
    { name: "Fat Loss Training", description: "A training focus for visitors with fat-loss goals." },
    { name: "Cardio Training", description: "Cardio sessions centered on endurance and movement." },
    { name: "Personal Training", description: "Ask the team about one-to-one coaching availability." },
    { name: "Body Transformation Program", description: "Discuss a training approach for your goals." },
    { name: "Beginner Fitness Program", description: "A place to start building a fitness routine." },
    { name: "Advanced Fitness Training", description: "Training options for experienced gym members." },
    { name: "General Fitness and Conditioning", description: "Training for general fitness and conditioning." },
  ],
  trainers: [
    {
      name: "Prince",
      age: "18 Years",
      experience: "5 Years",
      achievement: "Gold Medal Awarded",
      specializations: ["Strength Training", "Muscle Building", "Body Transformation", "Fitness Guidance"],
      photo: "photo-1581009146145-b5ef050c2e1e", // Representative stock image only; not Prince.
    },
    {
      name: "Ajay",
      age: "18 Years",
      experience: "5 Years",
      achievement: "Diamond Medal Awarded",
      specializations: ["Strength Training", "Muscle Building", "Fitness Training", "Body Transformation"],
      photo: "photo-1567013127542-490d757e51fc", // Representative stock image only; not Ajay.
    },
  ],
  social: {
    youtube: "https://youtube.com/@divine_signal_vault?si=Aqd6nB0F3oigyIaj",
  },
} as const;

export type MembershipPlan = (typeof gym.membershipPlans)[number];

export function whatsappHref(message: string): string {
  return `${gym.whatsappUrl}?text=${encodeURIComponent(message)}`;
}

export const whatsappMessages = {
  general: "Hello Fitness Point Dude! I want to know more about your gym and fitness services.",
  membership: "Hello Fitness Point Dude! I am interested in your membership plans. Please share more details.",
  freeTrial: "Hello Fitness Point Dude! I would like to enquire about a free trial session.",
  plan: (planName: string) => `Hello Fitness Point Dude! I am interested in the ${planName} Membership.`,
  program: (programName: string) => `Hello Fitness Point Dude Team!

I am interested in learning more about your fitness programs.

Program Name: ${programName}

I would like to know more about this program, including:

1. Complete program details.
2. Training process and schedule.
3. Membership fees and available packages.
4. Personal trainer guidance and support.
5. Enrollment process and how to get started.

Please share the complete details and guide me through the joining process.

Thank you!
Looking forward to hearing from you.

Best regards`,
} as const;
