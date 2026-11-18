import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

export const Route = createFileRoute("/(protected)/_protected")({
  // 하위 페이지를 그리기 전에 토큰이 없으면 로그인 페이지로 이동
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) {
      throw redirect({ to: "/login" });
    }
  },
  // 하위 페이지(/me, /me/edit)를 이 자리에 렌더링
  component: () => <Outlet />,
});