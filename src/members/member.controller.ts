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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateMemberDto } from './dto/create-member.dto.js';
import { MemberUpdateRequestDto } from './dto/member-update-request.dto.js';
import { MemberService } from './member.service.js';
import { AuthGuard } from '../common/guard/auth.guard.js';
import type { AuthenticatedRequest } from '../common/guard/auth.guard.js';
import { ApiException } from '../common/exception/api.exception.js';

@ApiTags('회원')
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

  @ApiOperation({
    summary: '회원가입',
    description:
      '이메일, 비밀번호, 닉네임으로 회원을 등록합니다. 토큰이 없어도 호출할 수 있는 공개 API입니다.',
  })
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
  @ApiOperation({
    summary: '내 정보 조회',
    description: 'JWT 인증을 통해 로그인한 회원의 정보를 조회합니다.',
  })
  @ApiBearerAuth('bearerAuth')
  @ApiResponse({
    status: 200,
    description: '회원 정보 조회 성공',
    schema: {
      example: {
        isSuccess: true,
        code: 'COMMON200',
        message: '회원 정보를 조회했습니다.',
        result: {
          memberId: 1,
          email: 'test@example.com',
          nickname: '영화조아',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Access Token이 없거나 유효하지 않은 경우',
    schema: {
      example: {
        isSuccess: false,
        code: 'AUTH401_2',
        message: '로그인이 필요한 요청입니다.',
        result: null,
      },
    },
  })
  // 4. 내 정보 조회 (JWT 인증 필요)
  @Get('me')
  @UseGuards(AuthGuard)
  async getMyInfo(@Req() request: AuthenticatedRequest) {
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
  @ApiOperation({
    summary: '내 정보 수정',
    description: 'JWT 인증을 통해 로그인한 회원의 정보를 수정합니다.',
  })
  @ApiBearerAuth('bearerAuth')
  @ApiResponse({
    status: 200,
    description: '회원 정보 수정 성공',
    schema: {
      example: {
        isSuccess: true,
        code: 'COMMON200',
        message: '회원 정보를 수정했습니다.',
        result: {
          memberId: 1,
          email: 'test@example.com',
          nickname: '새닉네임',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Access Token이 없거나 유효하지 않은 경우',
    schema: {
      example: {
        isSuccess: false,
        code: 'AUTH401_2',
        message: '로그인이 필요한 요청입니다.',
        result: null,
      },
    },
  })
  @Patch('me')
  @UseGuards(AuthGuard)
  async updateMyInfo(
    @Req() request: AuthenticatedRequest,
    @Body() dto: MemberUpdateRequestDto,
  ) {
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
