import { Subpage } from "@/components/subpage";
import { AuthForm } from "@/components/auth-form";
export default function RegisterPage() { return <Subpage eyebrow="A lovely place to start" title={<>Your next chapter, <em>starts here.</em></>} description="Create your student account. Your teacher will help connect you with the right batch."><AuthForm mode="register"/></Subpage> }
