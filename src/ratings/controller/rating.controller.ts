import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { CreateRatingDto } from '../../dto/create-rating.dto.js';
import { UpdateRatingDto } from '../../dto/update-rating.dto.js';
import { AuthGuard } from '../../guard/auth.guard.js';
import type { AuthenticatedRequest } from '../../guard/auth.guard.js';
import { ApiException } from '../../exception/api.exception.js';
import { RatingService } from '../../service/rating.service.js';

@Controller()
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  // JWT에서 검증한 회원 ID를 가져오는 공통 메서드
  private getMemberId(request: AuthenticatedRequest): number {
    const memberId = request.memberId;

    if (memberId === undefined) {
      throw new ApiException(
        HttpStatus.UNAUTHORIZED,
        'AUTH401_2',
        '로그인이 필요한 요청입니다.',
      );
    }

    return memberId;
  }

  // 1. 회원별 평점 조회 (공개 API)
  @Get('members/:memberId/ratings')
  getMemberRatings(@Param('memberId', ParseIntPipe) memberId: number) {
    return this.ratingService.getRatingsByMember(memberId);
  }

  // 2. 평점 등록 (JWT 인증 필요)
  @Post('ratings')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateRatingDto,
  ) {
    const memberId = this.getMemberId(request);

    const result = await this.ratingService.create(memberId, dto);

    return {
      isSuccess: true,
      code: 'COMMON201',
      message: '평점을 등록했습니다.',
      result,
    };
  }

  // 3. 평점 수정 (JWT 인증 필요)
  @Patch('ratings/:ratingId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async update(
    @Req() request: AuthenticatedRequest,
    @Param('ratingId', ParseIntPipe) ratingId: number,
    @Body() dto: UpdateRatingDto,
  ) {
    const memberId = this.getMemberId(request);

    const result = await this.ratingService.update(memberId, ratingId, dto);

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '평점을 수정했습니다.',
      result,
    };
  }

  // 4. 평점 삭제 (JWT 인증 필요)
  @Delete('ratings/:ratingId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async delete(
    @Req() request: AuthenticatedRequest,
    @Param('ratingId', ParseIntPipe) ratingId: number,
  ) {
    const memberId = this.getMemberId(request);

    await this.ratingService.delete(memberId, ratingId);

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '평점을 삭제했습니다.',
      result: null,
    };
  }
}
