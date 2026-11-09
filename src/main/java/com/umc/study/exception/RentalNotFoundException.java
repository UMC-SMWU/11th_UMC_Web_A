package com.umc.study.exception;

// 존재하지 않는 rentalId로 반납하려 할 때 던지는 예외. 404로 응답한다.
public class RentalNotFoundException extends RuntimeException {

    public RentalNotFoundException(Long rentalId) {
        super("존재하지 않는 대여 기록입니다. rentalId=" + rentalId);
    }
}
