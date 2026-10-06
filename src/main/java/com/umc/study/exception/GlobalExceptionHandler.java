package com.umc.study.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.LinkedHashMap;
import java.util.Map;

// 컨트롤러 어디서 예외가 나도 여기서 한 번에 받아서 일정한 JSON 형식으로 응답한다.
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 존재하지 않는 카테고리 -> 404
    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleCategoryNotFound(CategoryNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ErrorResponse.of(HttpStatus.NOT_FOUND.value(), e.getMessage()));
    }

    // @Valid 검증 실패(빈 제목, categoryId 누락 등) -> 400, 필드별 사유를 담는다.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException e) {
        Map<String, String> errors = new LinkedHashMap<>();
        for (FieldError fieldError : e.getBindingResult().getFieldErrors()) {
            String message = fieldError.getDefaultMessage() == null ? "잘못된 값입니다." : fieldError.getDefaultMessage();
            errors.putIfAbsent(fieldError.getField(), message);
        }
        return ResponseEntity.badRequest()
                .body(new ErrorResponse(HttpStatus.BAD_REQUEST.value(), "요청 값이 올바르지 않습니다.", errors));
    }

    // JSON 형식이 깨졌거나 값의 타입이 틀림(categoryId에 문자열 등) -> 400
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleNotReadable(HttpMessageNotReadableException e) {
        return ResponseEntity.badRequest()
                .body(ErrorResponse.of(HttpStatus.BAD_REQUEST.value(), "요청 본문을 읽을 수 없습니다. JSON 형식과 값의 타입을 확인해주세요."));
    }

    // 경로 변수 타입 오류(/books/category/abc) -> 400
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException e) {
        return ResponseEntity.badRequest()
                .body(ErrorResponse.of(HttpStatus.BAD_REQUEST.value(), "'" + e.getName() + "' 값의 형식이 올바르지 않습니다."));
    }
}
