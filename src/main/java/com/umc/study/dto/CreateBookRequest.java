package com.umc.study.dto;

public record CreateBookRequest(
        Long categoryId,
        String title,
        String description
) {
}