import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

// 로그인, 회원가입, 내 정보 화면이 같은 카드 레이아웃과 입력 스타일을 써요.
export const inputClass =
  "h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none placeholder:text-muted focus:border-brand disabled:cursor-not-allowed disabled:bg-surface disabled:text-muted";

export const secondaryButtonClass =
  "h-11 shrink-0 cursor-pointer rounded-lg border border-brand px-4 text-sm font-bold text-brand hover:bg-brand/5 disabled:cursor-not-allowed disabled:border-line disabled:text-muted disabled:hover:bg-transparent";

export const primaryButtonClass =
  "h-11 w-full cursor-pointer rounded-lg bg-brand text-sm font-bold text-white hover:bg-brand-hover disabled:cursor-not-allowed disabled:bg-brand/40";

interface AuthCardProps {
  title: string;
  children: ReactNode;
}

export function AuthCard({ title, children }: AuthCardProps) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="w-full max-w-[400px] rounded-2xl border border-line bg-white p-8">
        <h1 className="mb-8 text-center text-2xl font-extrabold text-ink">{title}</h1>
        {children}
      </div>
    </main>
  );
}

interface FieldProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
  error?: string;
  success?: string;
  hint?: string;
}

export function Field({ label, htmlFor, children, error, success, hint }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-sm font-bold text-ink">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
      {success && !error && <p className={cn("text-xs text-brand")}>{success}</p>}
    </div>
  );
}
