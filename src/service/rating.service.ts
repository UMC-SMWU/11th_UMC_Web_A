import {
  Injectable,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Member } from '../members/entities/member.entity.js';
import { Rating } from '../ratings/entities/rating.entity.js';

import { CreateRatingDto } from '../dto/create-rating.dto.js';
import { UpdateRatingDto } from '../dto/update-rating.dto.js';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,

    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  // ========================================
  // 5주차: 회원별 평점 조회
  // ========================================

  async getRatingsByMember(memberId: number) {
    const member = await this.memberRepository.findOneBy({
      memberId,
    });

    if (!member) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }

    const ratings = await this.ratingRepository.find({
      where: {
        member: { memberId },
      },
    });

    return ratings.map((rating) => ({
      ratingId: rating.ratingId,
      movieId: rating.movieId,
      score: rating.score,
      comment: rating.comment,
    }));
  }

  // ========================================
  // 6주차: 평점 등록
  // POST /members/:memberId/ratings
  // ========================================

  async create(memberId: number, dto: CreateRatingDto): Promise<number> {
    const member = await this.memberRepository.findOneBy({
      memberId,
    });

    if (!member) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }

    // 같은 영화에 평점을 이미 등록했는지 확인
    const existing = await this.ratingRepository.findOne({
      where: {
        member: { memberId },
        movieId: dto.movieId,
      },
    });

    if (existing) {
      throw new ConflictException('이미 이 영화에 평점을 남기셨습니다.');
    }

    // 새로운 평점 생성 및 저장
    const saved = await this.ratingRepository.save(
      this.ratingRepository.create({
        member,
        movieId: dto.movieId,
        score: dto.score,
        comment: dto.comment ?? null,
      }),
    );

    return saved.ratingId;
  }

  // ========================================
  // 6주차: 평점 수정
  // PATCH /members/:memberId/ratings/:ratingId
  // ========================================

  async update(
    ratingId: number,
    memberId: number,
    dto: UpdateRatingDto,
  ): Promise<void> {
    const rating = await this.findOwnedRating(ratingId, memberId);

    rating.score = dto.score;
    rating.comment = dto.comment ?? null;

    await this.ratingRepository.save(rating);
  }

  // ========================================
  // 6주차: 평점 삭제
  // DELETE /members/:memberId/ratings/:ratingId
  // ========================================

  async delete(ratingId: number, memberId: number): Promise<void> {
    const rating = await this.findOwnedRating(ratingId, memberId);

    await this.ratingRepository.remove(rating);
  }

  // ========================================
  // 공통 메서드: 평점 소유자 확인
  // ========================================

  private async findOwnedRating(
    ratingId: number,
    memberId: number,
  ): Promise<Rating> {
    const rating = await this.ratingRepository.findOne({
      where: { ratingId },
      relations: { member: true },
    });

    // 평점이 존재하지 않는 경우
    if (!rating) {
      throw new NotFoundException('존재하지 않는 평점입니다.');
    }

    // 다른 회원의 평점인 경우
    if (rating.member.memberId !== memberId) {
      throw new ForbiddenException(
        '본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.',
      );
    }

    return rating;
  }
}
