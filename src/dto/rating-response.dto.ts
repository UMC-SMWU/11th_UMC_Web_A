import { Rating } from '../ratings/entities/rating.entity.js';

export class RatingResponseDto {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;

  static from(rating: Rating): RatingResponseDto {
    return {
      ratingId: rating.ratingId,
      movieId: rating.movieId,
      score: rating.score,
      comment: rating.comment,
    };
  }
}
