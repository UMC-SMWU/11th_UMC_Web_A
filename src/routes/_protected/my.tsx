import { createFileRoute } from "@tanstack/react-router";
import { MyPage } from "@/views/auth/my/my-page";

export const Route = createFileRoute("/_protected/my")({
  component: MyPage,
});
