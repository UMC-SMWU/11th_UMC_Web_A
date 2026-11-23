// src/service/rating.service.spec.ts
import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Member } from '../entity/member.entity';
import { Rating } from '../entity/rating.entity';
import { ApiException } from '../exception/api.exception';
import { RatingService } from './rating.service';

describe('RatingService', () => {
  let ratingService: RatingService;

  // 진짜 DB 대신 들어갈 가짜 Repository입니다.
  const ratingRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  };
  const memberRepository = {
    findOneBy: jest.fn(),
  };

  const member = { memberId: 1, nickname: '영화조아' } as Member;

  beforeEach(async () => {
    jest.clearAllMocks(); // 앞 테스트에서 기억한 호출 기록을 지웁니다

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingService,
        { provide: getRepositoryToken(Rating), useValue: ratingRepository },
        { provide: getRepositoryToken(Member), useValue: memberRepository },
      ],
    }).compile();

    ratingService = module.get<RatingService>(RatingService);
  });

  it('같은 영화에 평점을 중복 등록하면 409 RATING409_1 예외를 던지고 저장하지 않는다', async () => {
    // given: 회원은 존재하고, 이 영화에 이미 평점을 남겨 둔 상황
    memberRepository.findOneBy.mockResolvedValue(member);
    ratingRepository.findOne.mockResolvedValue({ ratingId: 1, movieId: 550, score: 4 });

    // when: 같은 영화에 평점을 또 등록하면
    const error = await ratingService
      .create(1, { movieId: 550, score: 5, comment: '또 남겨요' })
      .catch((e: unknown) => e);

    // then: 409 RATING409_1 예외가 나고, 저장은 시도조차 하지 않는다
    expect(error).toBeInstanceOf(ApiException);
    expect((error as ApiException).code).toBe('RATING409_1');
    expect((error as ApiException).getStatus()).toBe(HttpStatus.CONFLICT);
    expect(ratingRepository.save).not.toHaveBeenCalled();
  });

  it('남의 평점을 수정하려 하면 403 RATING403_1 예외를 던지고 저장하지 않는다', async () => {
    // given: 10번 평점의 작성자는 2번 회원인 상황
    ratingRepository.findOne.mockResolvedValue({
      ratingId: 10,
      movieId: 550,
      score: 3,
      comment: null,
      member: { memberId: 2 },
    });

    // when: 1번 회원이 그 평점을 수정하려 하면
    const error = await ratingService
      .update(1, 10, { score: 5, comment: '내 맘대로 수정' })
      .catch((e: unknown) => e);

    // then: 403 RATING403_1 예외가 나고, 저장은 시도조차 하지 않는다
    expect(error).toBeInstanceOf(ApiException);
    expect((error as ApiException).code).toBe('RATING403_1');
    expect((error as ApiException).getStatus()).toBe(HttpStatus.FORBIDDEN);
    expect(ratingRepository.save).not.toHaveBeenCalled();
  });
});