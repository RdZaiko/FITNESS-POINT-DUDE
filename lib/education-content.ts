export type LearningCourse = {
  slug: string;
  subject: string;
  title: string;
  grade: string;
  description: string;
  image: string;
  lessonCount: number;
  duration: string;
  difficulty: string;
  objectives: string[];
  lessons: { id: string; title: string; duration: string; summary: string }[];
};

/** Synthetic outlines for the local preview; schedules and enrollment are not live. */
export const demoCourses: LearningCourse[] = [
  {
    slug: "mathematics-made-clear",
    subject: "Mathematics",
    title: "Mathematics, made clear.",
    grade: "Grade 9–10 · CBSE",
    description: "Build strong fundamentals, solve with confidence, and make room for every question.",
    image: "/course-mathematics.svg",
    lessonCount: 12,
    duration: "8-week sample outline",
    difficulty: "Foundations to intermediate",
    objectives: ["Connect algebraic ideas to visual patterns", "Choose a clear strategy for multi-step problems", "Check work and explain the reasoning"],
    lessons: [
      { id: "number-patterns", title: "Patterns, variables & expressions", duration: "18 min", summary: "Use familiar number patterns to describe relationships with variables." },
      { id: "linear-equations", title: "Linear equations, one step at a time", duration: "22 min", summary: "Build and solve equations while keeping both sides balanced." },
      { id: "coordinate-graphs", title: "Reading a graph with confidence", duration: "20 min", summary: "Connect coordinates, tables, and the shape of a line." },
      { id: "quadratic-intro", title: "A first look at quadratic patterns", duration: "24 min", summary: "Notice how a changing difference reveals a quadratic relationship." },
    ],
  },
  {
    slug: "physics-that-clicks",
    subject: "Physics",
    title: "Physics that clicks.",
    grade: "Grade 11–12 · CBSE",
    description: "Connect the ideas behind mechanics, waves, electricity, and light.",
    image: "/course-physics.svg",
    lessonCount: 14,
    duration: "10-week sample outline",
    difficulty: "Concepts to exam practice",
    objectives: ["Describe motion with words, graphs, and equations", "Choose a useful model before calculating", "Check units and explain what an answer means"],
    lessons: [
      { id: "motion-language", title: "The language of motion", duration: "19 min", summary: "Distinguish position, displacement, speed, and velocity." },
      { id: "motion-graphs", title: "Motion through graphs", duration: "23 min", summary: "Read slope and area as meaningful parts of a motion graph." },
      { id: "forces-first", title: "Forces and free-body sketches", duration: "21 min", summary: "Draw the forces in a situation before choosing an equation." },
      { id: "energy-paths", title: "Energy, work & useful boundaries", duration: "24 min", summary: "Follow energy transfers in a system and select a boundary." },
    ],
  },
  {
    slug: "chemistry-with-a-plan",
    subject: "Chemistry",
    title: "Chemistry with a plan.",
    grade: "Grade 11–12 · CBSE",
    description: "A calm route through concepts, reactions, practice, and revision.",
    image: "/course-chemistry.svg",
    lessonCount: 13,
    duration: "9-week sample outline",
    difficulty: "Concepts to exam practice",
    objectives: ["Move between particle models and chemical notation", "Use evidence to explain reaction patterns", "Build a repeatable revision routine"],
    lessons: [
      { id: "matter-models", title: "A particle model of matter", duration: "18 min", summary: "Use a particle model to explain the properties we can observe." },
      { id: "mole-bridge", title: "The mole as a counting bridge", duration: "22 min", summary: "Connect particle counts, amount of substance, and mass." },
      { id: "reaction-clues", title: "Reading reaction clues", duration: "20 min", summary: "Translate observations into a balanced chemical equation." },
      { id: "revision-map", title: "Make a useful revision map", duration: "16 min", summary: "Group related ideas and choose practice that reveals gaps." },
    ],
  },
];

export type DemoTeacher = {
  id: string;
  name: string;
  subject: string;
  grades: string;
  focus: string;
  sampleRating: number;
  sampleExperience: number;
  avatar: string;
};

/** Fictional cards are deliberately labelled; no real tutor credentials or reviews are implied. */
export const demoTeachers: DemoTeacher[] = [
  { id: "sample-math", name: "Sample mathematics tutor", subject: "Mathematics", grades: "Grades 9–10", focus: "Algebra, geometry, and patient problem-solving", sampleRating: 4.9, sampleExperience: 7, avatar: "M" },
  { id: "sample-physics", name: "Sample physics tutor", subject: "Physics", grades: "Grades 11–12", focus: "Mechanics, waves, and concept-first explanations", sampleRating: 4.8, sampleExperience: 6, avatar: "P" },
  { id: "sample-chemistry", name: "Sample chemistry tutor", subject: "Chemistry", grades: "Grades 11–12", focus: "Chemical reasoning, revision, and exam practice", sampleRating: 4.7, sampleExperience: 5, avatar: "C" },
];

export type DemoLearner = { id: string; name: string; subject: string; weeklyPoints: number; totalPoints: number; badge: string };

/** Synthetic leaderboard rows; they are not students or results from a real classroom. */
export const demoLearners: DemoLearner[] = [
  { id: "learner-1", name: "Mira", subject: "Mathematics", weeklyPoints: 570, totalPoints: 2840, badge: "Steady learner" },
  { id: "learner-2", name: "Kabir", subject: "Physics", weeklyPoints: 520, totalPoints: 2710, badge: "Curious thinker" },
  { id: "learner-3", name: "Aarav", subject: "Mathematics", weeklyPoints: 460, totalPoints: 2390, badge: "Practice streak" },
  { id: "learner-4", name: "Ira", subject: "Chemistry", weeklyPoints: 430, totalPoints: 2180, badge: "Careful checker" },
  { id: "learner-5", name: "Dev", subject: "Physics", weeklyPoints: 390, totalPoints: 1940, badge: "Great questions" },
  { id: "learner-6", name: "Nila", subject: "Chemistry", weeklyPoints: 350, totalPoints: 1820, badge: "Revision ready" },
];
