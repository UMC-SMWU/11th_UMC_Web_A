import { useState } from "react";
import { HTTPError } from "ky";
import { checkEmail } from "../../api/members/check-email";
import { checkNickname } from "../../api/members/check-nickname";
import { getMemberRatings } from "../../api/members/get-member-ratings";
import type { MemberRating } from "../../api/members/models";
import { cn } from "../../utils/cn";

type CheckResult = { ok: boolean; message: string } | null;

type CheckFieldProps = {
  label: string;
  placeholder: string;
  onCheck: (value: string) => Promise<boolean>;
};

function CheckField({ label, placeholder, onCheck }: CheckFieldProps) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<CheckResult>(null);

  async function handleCheck() {
    const trimmed = value.trim();
    if (!trimmed) return;

    try {
      const available = await onCheck(trimmed);
      setResult(
        available
          ? { ok: true, message: `사용 가능한 ${label}이에요.` }
          : { ok: false, message: `이미 사용 중인 ${label}이에요.` },
      );
    } catch {
      setResult({ ok: false, message: "요청에 실패했어요." });
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-ink">{label}</label>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="h-[42px] flex-1 rounded-lg border border-line px-3 text-sm"
        />
        <button
          type="button"
          onClick={handleCheck}
          className="h-[42px] rounded-lg bg-primary px-4 text-sm font-extrabold text-white"
        >
          중복 확인
        </button>
      </div>
      {result && (
        <p className={cn("text-sm", result.ok ? "text-green-600" : "text-red-500")}>
          {result.message}
        </p>
      )}
    </div>
  );
}

export function MyPage() {
  const [memberId, setMemberId] = useState("1");
  const [ratings, setRatings] = useState<MemberRating[] | null>(null);
  const [ratingsError, setRatingsError] = useState<string | null>(null);

  async function handleGetRatings() {
    setRatings(null);
    setRatingsError(null);

    try {
      const data = await getMemberRatings(Number(memberId));
      setRatings(data);
    } catch (error) {
      if (error instanceof HTTPError && error.response.status === 404) {
        setRatingsError("존재하지 않는 유저예요.");
      } else {
        setRatingsError("평점을 불러오지 못했어요.");
      }
    }
  }

  return (
    <main className="mx-auto flex max-w-[720px] flex-col gap-12 px-5 py-10">
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-black text-ink">닉네임 · 이메일 중복 확인</h2>
        <CheckField
          label="닉네임"
          placeholder="닉네임을 입력하세요"
          onCheck={async (value) => (await checkNickname(value)).available}
        />
        <CheckField
          label="이메일"
          placeholder="이메일을 입력하세요"
          onCheck={async (value) => (await checkEmail(value)).available}
        />
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-black text-ink">유저별 평점 조회</h2>
        <div className="flex gap-2">
          <input
            type="number"
            min={1}
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            className="h-[42px] w-32 rounded-lg border border-line px-3 text-sm"
          />
          <button
            type="button"
            onClick={handleGetRatings}
            className="h-[42px] rounded-lg bg-primary px-4 text-sm font-extrabold text-white"
          >
            평점 조회
          </button>
        </div>

        {ratingsError && <p className="text-sm text-red-500">{ratingsError}</p>}

        {ratings && ratings.length === 0 && (
          <p className="text-sm text-sub">아직 남긴 평점이 없어요.</p>
        )}

        {ratings && ratings.length > 0 && (
          <ul className="flex flex-col gap-3">
            {ratings.map((rating) => (
              <li key={rating.ratingId} className="rounded-lg border border-line p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-ink">영화 ID {rating.movieId}</span>
                  <span className="text-sm text-primary">{"★".repeat(rating.score)}</span>
                </div>
                {rating.comment && <p className="mt-2 text-sm text-ink">{rating.comment}</p>}
                <p className="mt-2 text-xs text-sub">
                  {new Date(rating.createdAt).toLocaleString("ko-KR")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}