// src/types/express.d.ts
import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    memberId?: number; // AuthGuard가 토큰 검증 후 담아두는 값
  }
}