// src/controller/rating.controller.ts
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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express'; // 데코레이터 시그니처에 쓰는 타입은 import type 이어야 합니다
import { RatingService } from '../service/rating.service';
import { CreateRatingDto } from '../dto/create-rating.dto';
import { UpdateRatingDto } from '../dto/update-rating.dto';
import { AuthGuard } from '../guard/auth.guard';
import { errorExample, successExample, unauthorizedResponse } from '../swagger/api-example';

// 응답 예시에 공통으로 쓰는 평점 한 건입니다.
const ratingExample = {
  ratingId: 1,
  movieId: 550,
  score: 5,
  comment: '다시 봐도 좋은 영화',
  createdAt: '2026-09-13T21:00:00.000Z',
  updatedAt: '2026-09-13T21:00:00.000Z',
};

@ApiTags('평점')
@Controller()
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  // 5주차에 만든 유저별 평점 조회입니다. 공개 API라 AuthGuard와 ApiBearerAuth를 붙이지 않습니다.
  @ApiOperation({
    summary: '유저별 평점 조회',
    description: '특정 회원이 남긴 평점 목록을 최신순으로 조회합니다. 토큰 없이 호출할 수 있는 공개 API입니다.',
  })
  @ApiResponse({ status: 200, description: '조회 성공 (평점 배열을 그대로 응답)', schema: { example: [ratingExample] } })
  @ApiResponse({ status: 404, description: '존재하지 않는 회원', schema: errorExample('MEMBER404_1', '해당 회원을 찾을 수 없습니다.') })
  @Get('members/:memberId/ratings')
  getMemberRatings(@Param('memberId', ParseIntPipe) memberId: number) {
    return this.ratingService.getRatingsByMember(memberId);
  }

  @ApiOperation({
    summary: '평점 등록',
    description: '토큰의 주인인 회원이 영화 하나에 별점(1~5)과 후기를 남깁니다. 같은 영화에는 한 번만 남길 수 있습니다.',
  })
  @ApiBearerAuth('bearerAuth')
  @ApiResponse({ status: 201, description: '평점 등록 성공', schema: successExample('COMMON201', '평점을 등록했습니다.', ratingExample) })
  @ApiResponse({ status: 400, description: '요청 값 검증 실패 (예: 별점이 1~5 범위 밖)', schema: errorExample('COMMON400', '별점은 5점 이하여야 합니다.') })
  @ApiResponse(unauthorizedResponse)
  @ApiResponse({ status: 409, description: '이미 이 영화에 평점을 남김', schema: errorExample('RATING409_1', '이미 이 영화에 평점을 남기셨습니다.') })
  @Post('ratings')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() request: Request, @Body() dto: CreateRatingDto) {
    const memberId = request['memberId'] as number;

    const result = await this.ratingService.create(memberId, dto);
    return {
      isSuccess: true,
      code: 'COMMON201',
      message: '평점을 등록했습니다.',
      result,
    };
  }

  @ApiOperation({
    summary: '평점 수정',
    description: '내가 남긴 평점의 별점과 후기를 수정합니다. 다른 회원의 평점은 수정할 수 없습니다.',
  })
  @ApiBearerAuth('bearerAuth')
  @ApiResponse({ status: 200, description: '평점 수정 성공', schema: successExample('COMMON200', '평점을 수정했습니다.', ratingExample) })
  @ApiResponse(unauthorizedResponse)
  @ApiResponse({ status: 403, description: '남의 평점을 수정하려 함', schema: errorExample('RATING403_1', '본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.') })
  @ApiResponse({ status: 404, description: '존재하지 않는 평점', schema: errorExample('RATING404_1', '해당 평점을 찾을 수 없습니다.') })
  @Patch('ratings/:ratingId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async update(
    @Req() request: Request,
    @Param('ratingId', ParseIntPipe) ratingId: number,
    @Body() dto: UpdateRatingDto,
  ) {
    const memberId = request['memberId'] as number;

    const result = await this.ratingService.update(memberId, ratingId, dto);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '평점을 수정했습니다.',
      result,
    };
  }

  @ApiOperation({
    summary: '평점 삭제',
    description: '내가 남긴 평점을 삭제합니다. 다른 회원의 평점은 삭제할 수 없습니다.',
  })
  @ApiBearerAuth('bearerAuth')
  @ApiResponse({ status: 200, description: '평점 삭제 성공', schema: successExample('COMMON200', '평점을 삭제했습니다.', null) })
  @ApiResponse(unauthorizedResponse)
  @ApiResponse({ status: 403, description: '남의 평점을 삭제하려 함', schema: errorExample('RATING403_1', '본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.') })
  @ApiResponse({ status: 404, description: '존재하지 않는 평점', schema: errorExample('RATING404_1', '해당 평점을 찾을 수 없습니다.') })
  @Delete('ratings/:ratingId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async delete(
    @Req() request: Request,
    @Param('ratingId', ParseIntPipe) ratingId: number,
  ) {
    const memberId = request['memberId'] as number;

    await this.ratingService.delete(memberId, ratingId);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '평점을 삭제했습니다.',
      result: null,
    };
  }
}