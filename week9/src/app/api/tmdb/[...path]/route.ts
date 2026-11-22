import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{ path: string[] }>;
  },
) {
  const { path } = await context.params;

  const baseUrl = process.env.NEXT_PUBLIC_TMDB_API_BASE_URL;
  const token = process.env.TMDB_ACCESS_TOKEN;

  if (!baseUrl || !token) {
    return NextResponse.json(
      { message: "TMDB 환경 변수가 필요해요." },
      { status: 500 },
    );
  }

  const url = new URL(`${baseUrl.replace(/\/$/, "")}/${path.join("/")}`);

  url.search = request.nextUrl.search;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "TMDB 요청 중 오류가 발생했어요." },
      { status: 502 },
    );
  }
}
