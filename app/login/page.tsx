import { Subpage } from "@/components/subpage";
import { AuthForm } from "@/components/auth-form";
export default function LoginPage() { return <Subpage eyebrow="Your classroom is waiting" title={<>Welcome back to <em>your learning space.</em></>} description="Sign in to see your batches, lessons, class notes, and next live session."><AuthForm mode="login"/></Subpage> }
