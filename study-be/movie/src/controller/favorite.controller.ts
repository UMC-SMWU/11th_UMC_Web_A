// src/controller/favorite.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateFavoriteDto } from '../dto/create-favorite.dto';
import { AuthGuard } from '../guard/auth.guard';
import { FavoriteService } from '../service/favorite.service';
import { errorExample, successExample, unauthorizedResponse } from '../swagger/api-example';

@ApiTags('즐겨찾기')
@ApiBearerAuth('bearerAuth') // 이 컨트롤러의 모든 API가 토큰을 요구합니다
@Controller('favorites')
@UseGuards(AuthGuard)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @ApiOperation({
    summary: '즐겨찾기 등록',
    description: '토큰의 주인인 회원이 TMDB 영화 ID 하나를 즐겨찾기에 추가합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '즐겨찾기 등록 성공',
    schema: {
      example: {
        isSuccess: true,
        code: 'COMMON201',
        message: '즐겨찾기를 등록했습니다.',
        result: { favoriteId: 1, movieId: 550, createdAt: '2026-09-13T21:00:00.000Z' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '토큰이 없거나 유효하지 않음',
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
    description: '이미 즐겨찾기한 영화',
    schema: {
      example: {
        isSuccess: false,
        code: 'FAVORITE409_1',
        message: '이미 이 영화를 즐겨찾기하셨습니다.',
        result: null,
      },
    },
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() request: Request, @Body() dto: CreateFavoriteDto) {
    const memberId = request['memberId'] as number;
    const result = await this.favoriteService.create(memberId, dto);

    return {
      isSuccess: true,
      code: 'COMMON201',
      message: '즐겨찾기를 등록했습니다.',
      result,
    };
  }

  @ApiOperation({
    summary: '내 즐겨찾기 목록 조회',
    description: '토큰의 주인인 회원이 즐겨찾기한 영화 목록을 조회합니다. 하나도 없으면 빈 배열을 응답합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    schema: successExample('COMMON200', '내 즐겨찾기 목록을 조회했습니다.', [
      { favoriteId: 1, movieId: 550, createdAt: '2026-09-13T21:00:00.000Z' },
    ]),
  })
  @ApiResponse(unauthorizedResponse)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getMyFavorites(@Req() request: Request) {
    const memberId = request['memberId'] as number;
    const result = await this.favoriteService.getMyFavorites(memberId);

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '내 즐겨찾기 목록을 조회했습니다.',
      result,
    };
  }

  @ApiOperation({
    summary: '즐겨찾기 여부 조회',
    description: '영화 하나를 내가 즐겨찾기했는지 확인합니다. 즐겨찾기하지 않았어도 오류가 아니라 isFavorite false로 응답합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    schema: successExample('COMMON200', '즐겨찾기 여부를 조회했습니다.', { isFavorite: false }),
  })
  @ApiResponse(unauthorizedResponse)
  @Get(':movieId')
  @HttpCode(HttpStatus.OK)
  async getStatus(
    @Req() request: Request,
    @Param('movieId', ParseIntPipe) movieId: number,
  ) {
    const memberId = request['memberId'] as number;
    const result = await this.favoriteService.getStatus(memberId, movieId);

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '즐겨찾기 여부를 조회했습니다.',
      result,
    };
  }

  @ApiOperation({
    summary: '즐겨찾기 해제',
    description: '즐겨찾기해 둔 영화를 목록에서 뺍니다.',
  })
  @ApiResponse({
    status: 200,
    description: '해제 성공',
    schema: successExample('COMMON200', '즐겨찾기를 해제했습니다.', null),
  })
  @ApiResponse(unauthorizedResponse)
  @ApiResponse({
    status: 404,
    description: '즐겨찾기하지 않은 영화',
    schema: errorExample('FAVORITE404_1', '즐겨찾기한 영화를 찾을 수 없습니다.'),
  })
  @Delete(':movieId')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Req() request: Request,
    @Param('movieId', ParseIntPipe) movieId: number,
  ) {
    const memberId = request['memberId'] as number;
    await this.favoriteService.delete(memberId, movieId);

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '즐겨찾기를 해제했습니다.',
      result: null,
    };
  }
}