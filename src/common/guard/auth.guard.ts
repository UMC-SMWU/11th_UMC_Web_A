import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import type { Request } from 'express';
import { ApiException } from '../exception/api.exception.js';

const BEARER_PREFIX = 'Bearer ';

// Request에 memberId 속성 추가
// 다른 Controller에서도 사용할 수 있도록 export
export type AuthenticatedRequest = Request & {
  memberId?: number;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * 컨트롤러 실행 전에 JWT를 검증합니다.
   * 성공하면 request.memberId에 회원 ID를 저장합니다.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const header = request.headers.authorization;

    // 1. Authorization 헤더 확인
    if (!header || !header.startsWith(BEARER_PREFIX)) {
      throw new ApiException(
        HttpStatus.UNAUTHORIZED,
        'AUTH401_2',
        '로그인이 필요한 요청입니다.',
      );
    }

    const token = header.slice(BEARER_PREFIX.length);

    try {
      // 2. JWT 서명 및 만료시간 검증
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
      }>(token);

      // 3. JWT에서 회원 ID 추출
      const memberId = Number(payload.sub);

      // 유효한 회원 ID인지 확인
      if (!Number.isSafeInteger(memberId) || memberId <= 0) {
        throw new Error('Invalid memberId');
      }

      // 4. 검증된 회원 ID를 요청 객체에 저장
      request.memberId = memberId;
    } catch (error) {
      // JWT 만료
      if (error instanceof TokenExpiredError) {
        throw new ApiException(
          HttpStatus.UNAUTHORIZED,
          'AUTH401_4',
          '토큰이 만료되었습니다. 다시 로그인해주세요.',
        );
      }

      // JWT 위조 또는 형식 오류
      throw new ApiException(
        HttpStatus.UNAUTHORIZED,
        'AUTH401_3',
        '유효하지 않은 토큰입니다.',
      );
    }

    return true;
  }
}
