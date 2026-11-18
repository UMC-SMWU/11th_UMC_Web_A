import { createFileRoute } from "@tanstack/react-router";
import { MeEditPage } from "../../pages/me/me-edit-page";

export const Route = createFileRoute("/me/edit")({ component: MeEditPage });