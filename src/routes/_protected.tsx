import { createFileRoute } from "@tanstack/react-router";
import { ProtectedLayout } from "@/components/layout/protected-layout";

export const Route = createFileRoute("/_protected")({
  component: ProtectedLayout,
});
