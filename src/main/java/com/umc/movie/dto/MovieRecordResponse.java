package com.umc.movie.dto;

// addToFavorites가 false이면 favorite은 null이다.
public record MovieRecordResponse(
        RatingResponse rating,
        FavoriteResponse favorite
) {
}
