export class FavoriteStatusResponseDto {
  isFavorite: boolean;

  static from(isFavorite: boolean): FavoriteStatusResponseDto {
    const dto = new FavoriteStatusResponseDto();

    dto.isFavorite = isFavorite;

    return dto;
  }
}
