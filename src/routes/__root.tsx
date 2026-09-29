import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      <Header />
      <Outlet />
    </div>
  ),
  notFoundComponent: () => (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-10 md:px-20">
      페이지를 찾을 수 없어요.
    </main>
  ),
});
