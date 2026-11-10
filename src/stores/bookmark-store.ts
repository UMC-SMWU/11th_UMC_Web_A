import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface BookmarkStore {
  bookmarkedMovieIds: number[];
  toggleBookmark: (movieId: number) => void;
}

// 저장값은 사용자가 개발자 도구에서 바꿀 수 있어서, 양의 정수 ID만 남기고 중복도 지워요.
function sanitizeMovieIds(value: unknown): number[] {
  if (!Array.isArray(value)) return [];

  const movieIds = value.filter(
    (movieId): movieId is number =>
      typeof movieId === "number" && Number.isInteger(movieId) && movieId > 0,
  );
  return [...new Set(movieIds)];
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set) => ({
      bookmarkedMovieIds: [],
      toggleBookmark: (movieId) =>
        set((state) => ({
          bookmarkedMovieIds: state.bookmarkedMovieIds.includes(movieId)
            ? state.bookmarkedMovieIds.filter((id) => id !== movieId)
            : [...state.bookmarkedMovieIds, movieId],
        })),
    }),
    {
      name: "umcine-bookmark-store",
      storage: createJSONStorage(() => localStorage),
      // 함수(toggleBookmark)는 저장하지 않고 북마크 ID 배열만 저장해요.
      partialize: (state) => ({
        bookmarkedMovieIds: state.bookmarkedMovieIds,
      }),
      // 저장값을 읽어올 때 한 번 더 검사해서, 값이 망가져 있어도 앱이 깨지지 않게 해요.
      merge: (persistedState, currentState) => ({
        ...currentState,
        bookmarkedMovieIds: sanitizeMovieIds(
          (persistedState as Partial<BookmarkStore> | undefined)?.bookmarkedMovieIds,
        ),
      }),
    },
  ),
);
