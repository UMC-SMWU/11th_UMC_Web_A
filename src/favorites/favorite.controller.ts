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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
interface AuthenticatedRequest extends Request {
  memberId: number;
}
import { CreateFavoriteDto } from './dto/create-favorite.dto.js';
import { AuthGuard } from '../common/guard/auth.guard.js';
import { FavoriteService } from './favorite.service.js';

@ApiTags('즐겨찾기')
@ApiBearerAuth('bearerAuth') // 이 컨트롤러의 모든 API가 토큰을 요구합니다
@Controller('favorites')
@UseGuards(AuthGuard)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @ApiOperation({
    summary: '즐겨찾기 등록',
    description:
      '토큰의 주인인 회원이 TMDB 영화 ID 하나를 즐겨찾기에 추가합니다.',
  })
  // NestJS는 컨트롤러가 돌려주는 객체의 모양을 실행 중에 알 수 없어서, 응답 예시를 직접 적어줍니다.
  @ApiResponse({
    status: 201,
    description: '즐겨찾기 등록 성공',
    schema: {
      example: {
        isSuccess: true,
        code: 'COMMON201',
        message: '즐겨찾기를 등록했습니다.',
        result: {
          favoriteId: 1,
          movieId: 550,
          createdAt: '2026-09-13T21:00:00.000Z',
        },
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
  async create(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateFavoriteDto,
  ) {
    const memberId = request['memberId'] as number;
    const result = await this.favoriteService.create(memberId, dto);

    return {
      isSuccess: true,
      code: 'COMMON201',
      message: '즐겨찾기를 등록했습니다.',
      result,
    };
  }
  // 2. 내 즐겨찾기 목록 조회
  @ApiOperation({
    summary: '내 즐겨찾기 목록 조회',
    description:
      'JWT 인증을 통해 로그인한 회원의 즐겨찾기 영화 목록을 조회합니다. (JWT 인증 필요)',
  })
  @ApiResponse({
    status: 200,
    description: '즐겨찾기 목록 조회 성공',
    schema: {
      example: {
        isSuccess: true,
        code: 'COMMON200',
        message: '내 즐겨찾기 목록을 조회했습니다.',
        result: [
          {
            favoriteId: 1,
            movieId: 550,
            createdAt: '2026-11-23T09:00:00.000Z',
          },
          {
            favoriteId: 2,
            movieId: 680,
            createdAt: '2026-11-23T09:10:00.000Z',
          },
        ],
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
  @Get()
  @HttpCode(HttpStatus.OK)
  async getMyFavorites(@Req() request: AuthenticatedRequest) {
    const memberId = request['memberId'] as number;
    const result = await this.favoriteService.getMyFavorites(memberId);

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '내 즐겨찾기 목록을 조회했습니다.',
      result,
    };
  }

  // 3. 즐겨찾기 여부 조회
  @ApiOperation({
    summary: '즐겨찾기 여부 조회',
    description:
      '로그인한 회원이 특정 영화를 즐겨찾기했는지 확인합니다. (JWT 인증 필요)',
  })
  @ApiParam({
    name: 'movieId',
    description: '즐겨찾기 여부를 확인할 TMDB 영화 ID',
    example: 550,
  })
  @ApiResponse({
    status: 200,
    description: '즐겨찾기 여부 조회 성공',
    schema: {
      example: {
        isSuccess: true,
        code: 'COMMON200',
        message: '즐겨찾기 여부를 조회했습니다.',
        result: {
          isFavorite: true,
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
  @Get(':movieId')
  @HttpCode(HttpStatus.OK)
  async getStatus(
    @Req() request: AuthenticatedRequest,
    @Param('movieId', ParseIntPipe) movieId: number,
  ) {
    const memberId = request.memberId;
    const result = await this.favoriteService.getStatus(memberId, movieId);

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '즐겨찾기 여부를 조회했습니다.',
      result,
    };
  }
  // 4. 즐겨찾기 해제
  @ApiOperation({
    summary: '즐겨찾기 해제',
    description:
      '로그인한 회원이 등록한 영화의 즐겨찾기를 해제합니다. (JWT 인증 필요)',
  })
  @ApiParam({
    name: 'movieId',
    description: '즐겨찾기를 해제할 TMDB 영화 ID',
    example: 550,
  })
  @ApiResponse({
    status: 200,
    description: '즐겨찾기 해제 성공',
    schema: {
      example: {
        isSuccess: true,
        code: 'COMMON200',
        message: '즐겨찾기를 해제했습니다.',
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
    status: 404,
    description: '즐겨찾기를 찾을 수 없는 경우',
    schema: {
      example: {
        isSuccess: false,
        code: 'FAVORITE404_1',
        message: '해당 즐겨찾기를 찾을 수 없습니다.',
        result: null,
      },
    },
  })
  @Delete(':movieId')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Req() request: AuthenticatedRequest,
    @Param('movieId', ParseIntPipe) movieId: number,
  ) {
    const memberId = request.memberId;
    await this.favoriteService.delete(memberId, movieId);

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '즐겨찾기를 해제했습니다.',
      result: null,
    };
  }
}
