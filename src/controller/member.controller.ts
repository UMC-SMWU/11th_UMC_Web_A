import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';

import { CreateMemberDto } from '../dto/create-member.dto.js';
import { MemberUpdateRequestDto } from '../dto/member-update-request.dto.js';
import { MemberService } from '../service/member.service.js';
import { AuthGuard } from '../guard/auth.guard.js';
import type { AuthenticatedRequest } from '../guard/auth.guard.js';
import { ApiException } from '../exception/api.exception.js';

@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  // 1. 닉네임 중복 확인
  @Get('nickname/:nickname')
  checkNickname(@Param('nickname') nickname: string) {
    return this.memberService.checkNickname(nickname);
  }

  // 2. 이메일 중복 확인
  @Get('email/:email')
  checkEmail(@Param('email') email: string) {
    return this.memberService.checkEmail(email);
  }

  // 3. 회원가입
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() dto: CreateMemberDto) {
    const result = await this.memberService.signUp(dto);

    return {
      isSuccess: true,
      code: 'COMMON201',
      message: '회원가입에 성공했습니다.',
      result,
    };
  }

  // 4. 내 정보 조회 (JWT 인증 필요)
  @Get('me')
  @UseGuards(AuthGuard)
  async getMyInfo(@Req() request: AuthenticatedRequest) {
    // AuthGuard에서 검증한 memberId 사용
    const memberId = request.memberId;

    if (memberId === undefined) {
      throw new ApiException(
        HttpStatus.UNAUTHORIZED,
        'AUTH401_2',
        '로그인이 필요한 요청입니다.',
      );
    }

    const result = await this.memberService.getMyInfo(memberId);

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '회원 정보를 조회했습니다.',
      result,
    };
  }

  // 5. 내 정보 수정 (JWT 인증 필요)
  @Patch('me')
  @UseGuards(AuthGuard)
  async updateMyInfo(
    @Req() request: AuthenticatedRequest,
    @Body() dto: MemberUpdateRequestDto,
  ) {
    // AuthGuard에서 검증한 회원 ID
    const memberId = request.memberId;

    if (memberId === undefined) {
      throw new ApiException(
        HttpStatus.UNAUTHORIZED,
        'AUTH401_2',
        '로그인이 필요한 요청입니다.',
      );
    }

    const result = await this.memberService.updateMyInfo(memberId, dto);

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '회원 정보를 수정했습니다.',
      result,
    };
  }
}
