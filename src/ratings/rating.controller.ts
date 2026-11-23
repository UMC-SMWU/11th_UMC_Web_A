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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateRatingDto } from './dto/create-rating.dto.js';
import { UpdateRatingDto } from './dto/update-rating.dto.js';
import { AuthGuard } from '../common/guard/auth.guard.js';
import type { AuthenticatedRequest } from '../common/guard/auth.guard.js';
import { ApiException } from '../common/exception/api.exception.js';
import { RatingService } from './rating.service.js';

@ApiTags('평점')
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

  // ========================================
  // 1. 회원별 평점 조회 (공개 API)
  // GET /members/:memberId/ratings
  // ========================================

  @ApiOperation({
    summary: '회원별 평점 조회',
    description:
      '특정 회원이 작성한 영화 평점 목록을 조회합니다. (인증 불필요)',
  })
  @ApiParam({
    name: 'memberId',
    description: '조회할 회원 ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '회원별 평점 조회 성공',
  })
  @ApiResponse({
    status: 404,
    description: '존재하지 않는 회원',
    schema: {
      example: {
        isSuccess: false,
        code: 'MEMBER404_1',
        message: '해당 회원을 찾을 수 없습니다.',
        result: null,
      },
    },
  })
  @Get('members/:memberId/ratings')
  getMemberRatings(@Param('memberId', ParseIntPipe) memberId: number) {
    return this.ratingService.getRatingsByMember(memberId);
  }

  // ========================================
  // 2. 평점 등록 (JWT 인증 필요)
  // POST /ratings
  // ========================================

  @ApiOperation({
    summary: '평점 등록',
    description: '로그인한 회원이 영화에 평점을 등록합니다. (JWT 인증 필요)',
  })
  @ApiBearerAuth('bearerAuth')
  @ApiResponse({
    status: 201,
    description: '평점 등록 성공',
    schema: {
      example: {
        isSuccess: true,
        code: 'COMMON201',
        message: '평점을 등록했습니다.',
        result: {
          ratingId: 1,
          movieId: 550,
          score: 5,
          comment: '재미있는 영화였어요.',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증되지 않은 요청',
    schema: {
      example: {
        isSuccess: false,
        code: 'AUTH401_2',
        message: '로그인이 필요한 요청입니다.',
        result: null,
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: '동일한 영화에 평점 중복 등록',
    schema: {
      example: {
        isSuccess: false,
        code: 'RATING409_1',
        message: '이미 이 영화에 평점을 남기셨습니다.',
        result: null,
      },
    },
  })
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

  // ========================================
  // 3. 평점 수정 (JWT 인증 필요)
  // PATCH /ratings/:ratingId
  // ========================================

  @ApiOperation({
    summary: '평점 수정',
    description:
      '로그인한 회원이 본인이 작성한 평점을 수정합니다. (JWT 인증 필요)',
  })
  @ApiBearerAuth('bearerAuth')
  @ApiParam({
    name: 'ratingId',
    description: '수정할 평점 ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '평점 수정 성공',
    schema: {
      example: {
        isSuccess: true,
        code: 'COMMON200',
        message: '평점을 수정했습니다.',
        result: {
          ratingId: 1,
          movieId: 550,
          score: 4,
          comment: '평점을 수정했습니다.',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증되지 않은 요청',
    schema: {
      example: {
        isSuccess: false,
        code: 'AUTH401_2',
        message: '로그인이 필요한 요청입니다.',
        result: null,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: '다른 회원이 작성한 평점 수정 불가',
    schema: {
      example: {
        isSuccess: false,
        code: 'RATING403_1',
        message: '본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.',
        result: null,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '존재하지 않는 평점',
    schema: {
      example: {
        isSuccess: false,
        code: 'RATING404_1',
        message: '해당 평점을 찾을 수 없습니다.',
        result: null,
      },
    },
  })
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

  // ========================================
  // 4. 평점 삭제 (JWT 인증 필요)
  // DELETE /ratings/:ratingId
  // ========================================

  @ApiOperation({
    summary: '평점 삭제',
    description:
      '로그인한 회원이 본인이 작성한 평점을 삭제합니다. (JWT 인증 필요)',
  })
  @ApiBearerAuth('bearerAuth')
  @ApiParam({
    name: 'ratingId',
    description: '삭제할 평점 ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '평점 삭제 성공',
    schema: {
      example: {
        isSuccess: true,
        code: 'COMMON200',
        message: '평점을 삭제했습니다.',
        result: null,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증되지 않은 요청',
    schema: {
      example: {
        isSuccess: false,
        code: 'AUTH401_2',
        message: '로그인이 필요한 요청입니다.',
        result: null,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: '다른 회원이 작성한 평점 삭제 불가',
    schema: {
      example: {
        isSuccess: false,
        code: 'RATING403_1',
        message: '본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.',
        result: null,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '존재하지 않는 평점',
    schema: {
      example: {
        isSuccess: false,
        code: 'RATING404_1',
        message: '해당 평점을 찾을 수 없습니다.',
        result: null,
      },
    },
  })
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
