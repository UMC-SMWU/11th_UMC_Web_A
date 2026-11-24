import { createFileRoute } from "@tanstack/react-router";
import { MyEditPage } from "@/views/auth/my/my-edit-page";

export const Route = createFileRoute("/_protected/my-edit")({
  component: MyEditPage,
});
