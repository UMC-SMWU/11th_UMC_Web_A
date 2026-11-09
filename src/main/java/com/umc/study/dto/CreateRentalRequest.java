package com.umc.study.dto;

import jakarta.validation.constraints.NotNull;

// 대여 요청 DTO. Map 대신 쓰면 userId/bookId가 빠졌거나 숫자가 아닐 때 500이 아니라 400으로 응답한다.
public record CreateRentalRequest(
        @NotNull(message = "userId는 필수입니다.")
        Long userId,

        @NotNull(message = "bookId는 필수입니다.")
        Long bookId
) {
}
