import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 영화 포스터와 배경 이미지는 TMDB 서버에서 가져와요. 허용 목록에 등록해야 next/image를 쓸 수 있어요.
    remotePatterns: [{ protocol: "https", hostname: "image.tmdb.org" }],
  },
};

export default nextConfig;
