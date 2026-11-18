import { createFileRoute } from "@tanstack/react-router";
import { MePage } from "../../../../pages/me/me-page";

export const Route = createFileRoute("/(protected)/_protected/me/")({
  component: MePage,
});