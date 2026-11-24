package com.umc.movie.service;

import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class RatingServiceTest {

    @Mock
    private RatingRepository ratingRepository;

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private RatingService ratingService;

    private Member member(Long id) {
        Member member = Member.builder()
                .email("challenger@umc.com")
                .password("$2a$10$abcdefghijklmnopqrstuv")
                .nickname("영화조아")
                .build();
        ReflectionTestUtils.setField(member, "memberId", id);
        return member;
    }

    @Test
    @DisplayName("이미 평점을 남긴 영화에 또 남기면 RATING409_1 예외가 난다")
    void createThrowsWhenDuplicate() {
        // given
        given(memberRepository.findById(1L)).willReturn(Optional.of(member(1L)));
        given(ratingRepository.existsByMember_MemberIdAndMovieId(1L, 550L)).willReturn(true);

        // when & then
        assertThatThrownBy(() -> ratingService.create(1L, new CreateRatingRequest(550L, 5, "최고")))
                .isInstanceOf(ApiException.class)
                .hasMessage("이미 이 영화에 평점을 남기셨습니다.");
        verify(ratingRepository, never()).save(any(Rating.class));
    }

    @Test
    @DisplayName("다른 사람의 평점을 수정하면 RATING403_1 예외가 난다")
    void updateThrowsWhenNotOwner() {
        // given: 평점 주인은 1번 회원, 요청자는 2번 회원
        Rating rating = Rating.builder()
                .member(member(1L))
                .movieId(550L)
                .score(5)
                .comment("최고")
                .build();
        given(ratingRepository.findById(10L)).willReturn(Optional.of(rating));

        // when & then
        assertThatThrownBy(() -> ratingService.update(2L, 10L, new UpdateRatingRequest(1, "별로")))
                .isInstanceOf(ApiException.class)
                .hasMessage("본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.");
    }
}
