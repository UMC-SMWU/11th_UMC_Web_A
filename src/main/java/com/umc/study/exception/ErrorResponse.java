package com.umc.study.exception;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Map;

// 오류 응답의 약속. errors는 입력 검증 실패처럼 필드별 사유가 있을 때만 담는다.
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
        int status,
        String message,
        Map<String, String> errors
) {
    public static ErrorResponse of(int status, String message) {
        return new ErrorResponse(status, message, null);
    }
}
