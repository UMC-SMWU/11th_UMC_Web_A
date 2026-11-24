import type { Metadata } from "next";
import { GuestGuard } from "@/components/auth/auth-guard";
import { LoginPage } from "@/screens/auth/login-page";

export const metadata: Metadata = { title: "로그인" };

export default function Page() {
  return (
    <GuestGuard>
      <LoginPage />
    </GuestGuard>
  );
}
