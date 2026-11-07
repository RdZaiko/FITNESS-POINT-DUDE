import { Subpage } from "@/components/subpage";
import { DemoLeaderboard } from "@/components/demo-leaderboard";
import { getUserContext } from "@/lib/auth";
import { demoLearners } from "@/lib/education-content";

export const instant = false;

export default async function LeaderboardPage() {
  const user = await getUserContext();
  return <Subpage eyebrow="Celebrate the practice" title={<>Progress is personal.<br/><em>Learning can be shared.</em></>} description="A friendly example of how a classroom could celebrate study habits and small learning wins.">
    <DemoLeaderboard learners={demoLearners} studentPreview={user?.demo === true && user.role === "student"}/>
  </Subpage>;
}
