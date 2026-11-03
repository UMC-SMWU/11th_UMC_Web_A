package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.EmailCheckResponse;
import com.umc.movie.dto.MemberResponse;
import com.umc.movie.dto.NicknameCheckResponse;
import com.umc.movie.dto.SignUpRequest;
import com.umc.movie.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataIntegrityViolationException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/nickname/{nickname}")
    public NicknameCheckResponse checkNickname(@PathVariable String nickname) {
        return memberService.checkNickname(nickname);
    }

    @GetMapping("/email/{email}")
    public EmailCheckResponse checkEmail(@PathVariable String email) {
        return memberService.checkEmail(email);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<?>> signUp(
            @Valid @RequestBody SignUpRequest request
    ) {
        try {
            MemberResponse response = memberService.signUp(request);

            return ResponseEntity.status(201)
                    .body(ApiResponse.created("회원가입에 성공했습니다.", response));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(409)
                    .body(ApiResponse.failure("MEMBER409", e.getMessage()));

        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(409)
                    .body(ApiResponse.failure(
                            "MEMBER409",
                            "이미 사용 중인 이메일 또는 닉네임입니다."
                    ));
        }
    }
}