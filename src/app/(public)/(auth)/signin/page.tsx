import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signin | PlantScan",
  description: "Secure login for PlantScan Admin Dashboard",
};

export default function SignIn() {
  return <SignInForm />;
}
