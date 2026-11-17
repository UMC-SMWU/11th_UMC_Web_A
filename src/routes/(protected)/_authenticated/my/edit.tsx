import { createFileRoute } from "@tanstack/react-router";
import { EditPage } from "../../../../pages/my/edit-page";

export const Route = createFileRoute("/(protected)/_authenticated/my/edit")({
  component: EditPage,
});
