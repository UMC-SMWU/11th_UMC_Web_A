// src/swagger/api-example.ts
// Swagger 응답 예시마다 반복되는 { isSuccess, code, message, result } 모양을 만들어 주는 함수들입니다.

export const successExample = (code: string, message: string, result: unknown) => ({
  example: { isSuccess: true, code, message, result },
});

export const errorExample = (code: string, message: string) => ({
  example: { isSuccess: false, code, message, result: null },
});

// 토큰이 필요한 API마다 똑같이 붙는 401 응답입니다.
export const unauthorizedResponse = {
  status: 401,
  description: '토큰이 없거나 유효하지 않음',
  schema: errorExample('AUTH401_2', '로그인이 필요한 요청입니다.'),
};