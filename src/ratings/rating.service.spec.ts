import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RatingService } from './rating.service.js';
import { Rating } from './entities/rating.entity.js';
import { Member } from '../members/entities/member.entity.js';
import { ApiException } from '../common/exception/api.exception.js';

describe('RatingService 단위 테스트', () => {
  let ratingService: RatingService;

  // 실제 DB 대신 사용할 Mock Repository
  const ratingRepository = {
    findOne: vi.fn(),
    save: vi.fn(),
    create: vi.fn(),
    remove: vi.fn(),
  };

  const memberRepository = {
    findOneBy: vi.fn(),
  };

  const member = {
    memberId: 1,
    nickname: '영화조아',
  } as Member;

  beforeEach(async () => {
    // 테스트 간 Mock 호출 기록과 구현 초기화
    vi.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingService,
        {
          provide: getRepositoryToken(Rating),
          useValue: ratingRepository,
        },
        {
          provide: getRepositoryToken(Member),
          useValue: memberRepository,
        },
      ],
    }).compile();

    ratingService = module.get<RatingService>(RatingService);
  });

  // ========================================
  // 테스트 1. 평점 중복 등록
  // ========================================

  it('같은 영화에 평점을 중복 등록하면 409와 RATING409_1 예외가 발생한다', async () => {
    // Given: 회원이 존재하고, 이미 해당 영화에 평점을 남긴 상태
    memberRepository.findOneBy.mockResolvedValue(member);

    ratingRepository.findOne.mockResolvedValue({
      ratingId: 1,
      movieId: 550,
      score: 5,
      member,
    });

    // When: 동일한 영화에 다시 평점 등록 시도
    let caughtError: unknown;

    try {
      await ratingService.create(1, {
        movieId: 550,
        score: 4,
        comment: '두 번째 평점',
      });
    } catch (error) {
      caughtError = error;
    }

    // Then: 409 상태와 RATING409_1 코드 검증
    expect(caughtError).toBeInstanceOf(ApiException);

    const exception = caughtError as ApiException;

    expect(exception.getStatus()).toBe(HttpStatus.CONFLICT);
    expect(exception.getResponse()).toBe('이미 이 영화에 평점을 남기셨습니다.');

    // 중복된 평점은 저장하지 않아야 함
    expect(ratingRepository.save).not.toHaveBeenCalled();
  });

  // ========================================
  // 테스트 2. 다른 회원의 평점 수정
  // ========================================

  it('다른 회원의 평점을 수정하면 403과 RATING403_1 예외가 발생한다', async () => {
    // Given: 회원 2가 작성한 평점이 존재
    const otherMember = {
      memberId: 2,
      nickname: '다른회원',
    } as Member;

    ratingRepository.findOne.mockResolvedValue({
      ratingId: 10,
      movieId: 550,
      score: 5,
      member: otherMember,
    });

    // When: 회원 1이 회원 2의 평점 수정 시도
    let caughtError: unknown;

    try {
      await ratingService.update(1, 10, {
        score: 3,
        comment: '수정 시도',
      });
    } catch (error) {
      caughtError = error;
    }

    // Then: 403 상태와 RATING403_1 코드 검증
    expect(caughtError).toBeInstanceOf(ApiException);

    const exception = caughtError as ApiException;

    expect(exception.getStatus()).toBe(HttpStatus.FORBIDDEN);
    expect(exception.getResponse()).toBe(
      '본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.',
    );

    // 본인의 평점이 아니므로 저장하지 않아야 함
    expect(ratingRepository.save).not.toHaveBeenCalled();
  });
});
