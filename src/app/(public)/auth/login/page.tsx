"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  const router = useRouter();

  return (
    <LoginForm
      onSuccess={() => router.push("/dashboard")}
      onSignupClick={() => router.push("/auth/signup")}
      onForgotPasswordClick={() => router.push("/auth/forgot-password")}
    />
  );
}
