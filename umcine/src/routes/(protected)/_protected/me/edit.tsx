import { createFileRoute } from "@tanstack/react-router";
import { MeEditPage } from "../../../../pages/me/me-edit-page";

export const Route = createFileRoute("/(protected)/_protected/me/edit")({ component: MeEditPage });