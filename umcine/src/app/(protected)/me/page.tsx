import type { Metadata } from "next";
import { MePage } from "@/screens/me/me-page";

export const metadata: Metadata = { title: "내 정보" };

export default function MeRoute() {
  return <MePage />;
}