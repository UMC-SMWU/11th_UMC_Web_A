// TMDB의 개봉일은 "2026-07-29" 형식이라 화면 디자인의 "2026.07.29" 형식으로 바꿔요.
export function formatReleaseDate(releaseDate: string) {
  return releaseDate ? releaseDate.replaceAll("-", ".") : "개봉일 정보 없음";
}

// 상영 시간은 분 단위 숫자로 와서 "2시간 25분" 형식으로 바꿔요. 값이 없으면 null이에요.
export function formatRuntime(runtime: number | null) {
  if (!runtime) return "상영 시간 정보가 없어요.";

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (hours === 0) return `${minutes}분`;
  if (minutes === 0) return `${hours}시간`;
  return `${hours}시간 ${minutes}분`;
}
