package com.umc.movie.controller;

import com.umc.movie.dto.*;
import com.umc.movie.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataIntegrityViolationException;
import com.umc.movie.dto.MemberInfoResponse;
import com.umc.movie.interceptor.AuthInterceptor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestAttribute;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {

    private final MemberService memberService;
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> getMyInfo(
            // 인터셉터가 request.setAttribute("memberId", ...)로 담아둔 값을 꺼냅니다
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId
    ) {
        MemberInfoResponse response = memberService.getMyInfo(memberId);
        return ResponseEntity.ok(ApiResponse.ok("회원 정보를 조회했습니다.", response));
    }

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
    // src/main/java/com/umc/movie/controller/MemberController.java 에 아래 메서드를 추가합니다
    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> updateMyInfo(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @RequestBody @Valid MemberUpdateRequest request
    ) {
        MemberInfoResponse response = memberService.updateMyInfo(memberId, request);
        return ResponseEntity.ok(ApiResponse.ok("회원 정보를 수정했습니다.", response));
    }
}