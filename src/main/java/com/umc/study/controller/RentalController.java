package com.umc.study.controller;

import com.umc.study.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    // POST http://localhost:8080/rentals
    @PostMapping
    public String createRental(@RequestBody Map<String, Object> body) {
        rentalService.createRental(body);
        return "대여 기록이 생성되었습니다!";
    }

    // PATCH http://localhost:8080/rentals/1/return
    @PatchMapping("/{rentalId}/return")
    public ResponseEntity<String> returnBook(@PathVariable Long rentalId) {
        if (rentalService.returnBook(rentalId)) {
            return ResponseEntity.ok("반납 처리가 완료되었습니다!");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("존재하지 않거나 이미 반납된 대여 기록입니다.");
    }
}