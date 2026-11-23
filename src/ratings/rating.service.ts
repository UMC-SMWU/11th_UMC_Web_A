import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Member } from '../members/entities/member.entity.js';
import { Rating } from './entities/rating.entity.js';

import { CreateRatingDto } from './dto/create-rating.dto.js';
import { UpdateRatingDto } from './dto/update-rating.dto.js';
import { ApiException } from '../common/exception/api.exception.js';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,

    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  // ========================================
  // 1. 회원별 평점 조회 (공개 API)
  // GET /members/:memberId/ratings
  // ========================================

  async getRatingsByMember(memberId: number) {
    const member = await this.memberRepository.findOneBy({
      memberId,
    });

    if (!member) {
      throw new ApiException(
        HttpStatus.NOT_FOUND,
        'MEMBER404_1',
        '해당 회원을 찾을 수 없습니다.',
      );
    }

    const ratings = await this.ratingRepository.find({
      where: {
        member: { memberId },
      },
      order: { ratingId: 'DESC' },
    });

    return ratings.map((rating) => ({
      ratingId: rating.ratingId,
      movieId: rating.movieId,
      score: rating.score,
      comment: rating.comment,
    }));
  }

  // ========================================
  // 2. 평점 등록 (JWT 인증)
  // POST /ratings
  // ========================================

  async create(memberId: number, dto: CreateRatingDto) {
    const member = await this.memberRepository.findOneBy({
      memberId,
    });

    if (!member) {
      throw new ApiException(
        HttpStatus.NOT_FOUND,
        'MEMBER404_1',
        '해당 회원을 찾을 수 없습니다.',
      );
    }

    // 동일한 영화에 평점을 등록했는지 확인
    const existing = await this.ratingRepository.findOne({
      where: {
        member: { memberId },
        movieId: dto.movieId,
      },
    });

    if (existing) {
      throw new ApiException(
        HttpStatus.CONFLICT,
        'RATING409_1',
        '이미 이 영화에 평점을 남기셨습니다.',
      );
    }

    // 평점 생성 및 저장
    const saved = await this.ratingRepository.save(
      this.ratingRepository.create({
        member,
        movieId: dto.movieId,
        score: dto.score,
        comment: dto.comment ?? null,
      }),
    );

    // ratingId뿐 아니라 평점 정보 전체 반환
    return this.toRatingResponse(saved);
  }

  // ========================================
  // 3. 평점 수정 (JWT 인증 + 소유권 검증)
  // PATCH /ratings/:ratingId
  // ========================================

  async update(memberId: number, ratingId: number, dto: UpdateRatingDto) {
    const rating = await this.findOwnedRating(memberId, ratingId);

    rating.score = dto.score;
    rating.comment = dto.comment ?? null;

    const saved = await this.ratingRepository.save(rating);

    return this.toRatingResponse(saved);
  }

  // ========================================
  // 4. 평점 삭제 (JWT 인증 + 소유권 검증)
  // DELETE /ratings/:ratingId
  // ========================================

  async delete(memberId: number, ratingId: number): Promise<void> {
    const rating = await this.findOwnedRating(memberId, ratingId);

    await this.ratingRepository.remove(rating);
  }

  // ========================================
  // 5. 평점 소유권 검증
  // ========================================

  private async findOwnedRating(
    memberId: number,
    ratingId: number,
  ): Promise<Rating> {
    const rating = await this.ratingRepository.findOne({
      where: { ratingId },
      relations: { member: true },
    });

    // 평점이 존재하지 않는 경우
    if (!rating) {
      throw new ApiException(
        HttpStatus.NOT_FOUND,
        'RATING404_1',
        '해당 평점을 찾을 수 없습니다.',
      );
    }

    // 다른 회원이 작성한 평점인 경우
    if (rating.member.memberId !== memberId) {
      throw new ApiException(
        HttpStatus.FORBIDDEN,
        'RATING403_1',
        '본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.',
      );
    }

    return rating;
  }

  // ========================================
  // 6. 평점 응답 변환
  // ========================================

  private toRatingResponse(rating: Rating) {
    return {
      ratingId: rating.ratingId,
      movieId: rating.movieId,
      score: rating.score,
      comment: rating.comment,
    };
  }
}
