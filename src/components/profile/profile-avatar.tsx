import { cn } from "../../utils/cn";

interface ProfileAvatarProps {
  imageUrl?: string | null;
  className?: string;
}

export function ProfileAvatar({ imageUrl, className }: ProfileAvatarProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e5e7eb]",
        className,
      )}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="프로필 이미지" className="h-full w-full object-cover" />
      ) : (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-1/2 w-1/2 text-[#111111]"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
        </svg>
      )}
    </div>
  );
}