import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../stores/auth-store";

// 로그인한 사용자만 들어올 수 있는 페이지를 묶는 레이아웃 라우트예요. (URL에는 나타나지 않아요.)
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) {
      throw redirect({ to: "/login" });
    }
  },
  component: () => <Outlet />,
});
