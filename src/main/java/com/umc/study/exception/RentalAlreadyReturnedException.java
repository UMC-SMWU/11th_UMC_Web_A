package com.umc.study.exception;

// 이미 반납한 대여 기록을 다시 반납하려 할 때 던지는 예외. 409로 응답한다.
public class RentalAlreadyReturnedException extends RuntimeException {

    public RentalAlreadyReturnedException(Long rentalId) {
        super("이미 반납된 대여 기록입니다. rentalId=" + rentalId);
    }
}
