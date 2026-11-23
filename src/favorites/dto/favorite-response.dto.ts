import { Favorite } from '../entities/favorite.entity.js';

export class FavoriteResponseDto {
  favoriteId: number;
  movieId: number;

  static from(favorite: Favorite): FavoriteResponseDto {
    const dto = new FavoriteResponseDto();

    dto.favoriteId = favorite.favoriteId;
    dto.movieId = favorite.movieId;

    return dto;
  }
}
