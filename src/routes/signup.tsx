// src/routes/signup.tsx
import { createFileRoute } from "@tanstack/react-router";
import { SignupPage } from "@/pages/auth/signup-page"; // 실제 컴포넌트 경로에 맞게 수정

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});
