import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface StatusMessageProps {
  children: ReactNode;
  // error는 스크린 리더가 바로 읽도록 role="alert", 그 외에는 role="status"로 알려요.
  tone?: "default" | "error";
  // 있으면 "다시 시도" 버튼을 보여 줘요. 마지막으로 실패한 요청을 다시 실행해요.
  onRetry?: () => void;
  className?: string;
}

export function StatusMessage({ children, tone = "default", onRetry, className }: StatusMessageProps) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn("flex flex-col items-center gap-4 py-10 text-center", className)}
    >
      <p className={cn("text-[15px]", tone === "error" ? "font-bold text-ink" : "text-muted")}>
        {children}
      </p>
      {onRetry ? (
        <button
          type="button"
          className="h-10 cursor-pointer rounded-lg bg-brand px-5 text-sm font-bold text-white hover:bg-brand-hover"
          onClick={onRetry}
        >
          다시 시도
        </button>
      ) : null}
    </div>
  );
}
