import type { ReactNode } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";

// 로그인한 사용자만 들어올 수 있는 페이지를 묶는 레이아웃이에요. (괄호 폴더는 URL에 나타나지 않아요.)
export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
