"use client";

import { useRouter } from "next/navigation";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  const router = useRouter();

  return (
    <SignupForm
      onSuccess={() => router.push("/dashboard")}
      onLoginClick={() => router.push("/auth/login")}
    />
  );
}
