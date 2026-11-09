package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import com.umc.movie.exception.DuplicateEmailException;
import com.umc.movie.exception.DuplicateNicknameException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 입력값 검증 실패 (@Valid) -> 400
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        return ResponseEntity.badRequest().body(ApiResponse.failure("COMMON4001", message));
    }

    // JSON 형식이 깨졌거나 타입이 맞지 않는 요청 본문 (예: score에 "abc") -> 400
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotReadable(HttpMessageNotReadableException exception) {
        return ResponseEntity.badRequest()
                .body(ApiResponse.failure("COMMON4002", "요청 본문 형식이 올바르지 않습니다."));
    }

    // 경로 변수 타입이 맞지 않는 요청 (예: /members/abc/ratings) -> 400
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<Void>> handleTypeMismatch(MethodArgumentTypeMismatchException exception) {
        return ResponseEntity.badRequest()
                .body(ApiResponse.failure("COMMON4003", "요청 값의 형식이 올바르지 않습니다."));
    }

    // 서비스의 사전 중복 검사 -> 409 (이메일/닉네임은 code를 구분)
    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<ApiResponse<Void>> handleDuplicateEmail(DuplicateEmailException exception) {
        return ResponseEntity.status(409).body(ApiResponse.failure("MEMBER4091", exception.getMessage()));
    }

    @ExceptionHandler(DuplicateNicknameException.class)
    public ResponseEntity<ApiResponse<Void>> handleDuplicateNickname(DuplicateNicknameException exception) {
        return ResponseEntity.status(409).body(ApiResponse.failure("MEMBER4092", exception.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgument(IllegalArgumentException exception) {
        return ResponseEntity.status(409).body(ApiResponse.failure("COMMON4092", exception.getMessage()));
    }

    // 사전 검사를 통과해도 동시 요청 등으로 DB UNIQUE 제약이 막은 경우 -> 같은 형식의 409
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrity(DataIntegrityViolationException exception) {
        String detail = exception.getMostSpecificCause().getMessage();
        if (detail != null) {
            if (detail.contains("member.email")) {
                return ResponseEntity.status(409)
                        .body(ApiResponse.failure("MEMBER4091", "이미 사용 중인 이메일입니다."));
            }
            if (detail.contains("member.nickname")) {
                return ResponseEntity.status(409)
                        .body(ApiResponse.failure("MEMBER4092", "이미 사용 중인 닉네임입니다."));
            }
            if (detail.contains("uk_rating_member_movie")) {
                return ResponseEntity.status(409)
                        .body(ApiResponse.failure("COMMON4092", "이미 이 영화에 평점을 남기셨습니다."));
            }
        }
        return ResponseEntity.status(409).body(ApiResponse.failure("COMMON4091", "이미 존재하는 데이터입니다."));
    }

    // 404, 403 등 서비스에서 던진 상태 코드 그대로 응답
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<Void>> handleResponseStatus(ResponseStatusException exception) {
        int status = exception.getStatusCode().value();
        return ResponseEntity.status(status)
                .body(ApiResponse.failure("COMMON" + status, exception.getReason()));
    }
}
