import type { Metadata } from "next";
import { MeEditPage } from "@/screens/me/me-edit-page";

export const metadata: Metadata = { title: "내 정보 수정" };

export default function MeEditRoute() {
  return <MeEditPage />;
}