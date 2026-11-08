import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ProfileStore {
  nickname: string;
  email: string;
  setNickname: (nickname: string) => void;
}

// 임시 데이터. 내 정보 API 연결 후 서버 응답으로 교체
export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      nickname: "gs0428",
      email: "gwangsoo@cinemalab.kr",
      setNickname: (nickname) => set({ nickname }),
    }),
    {
      name: "umcine-profile-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);