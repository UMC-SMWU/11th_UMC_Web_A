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

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
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

    @Test
    @DisplayName("같은 영화에 평점을 중복 등록하면 409와 RATING409_1 예외가 발생하고 저장되지 않는다")
    void createRatingWhenDuplicated() {
        // given
        Long memberId = 1L;
        Long movieId = 10L;
        Member member = mock(Member.class);
        CreateRatingRequest request = new CreateRatingRequest(movieId, 5, "재밌어요");

        given(memberRepository.findById(memberId)).willReturn(Optional.of(member));
        given(ratingRepository.existsByMember_MemberIdAndMovieId(memberId, movieId)).willReturn(true);

        // when
        ApiException exception = assertThrows(ApiException.class,
                () -> ratingService.create(memberId, request));

        // then
        assertThat(exception.getStatus().value()).isEqualTo(409);
        assertThat(exception.getCode()).isEqualTo("RATING409_1");
        verify(ratingRepository, never()).save(any(Rating.class));
    }

    @Test
    @DisplayName("다른 회원의 평점을 수정하려 하면 403과 RATING403_1 예외가 발생한다")
    void updateRatingWhenNotOwner() {
        // given
        Long ownerId = 1L;
        Long otherMemberId = 2L;
        Long ratingId = 100L;

        Member owner = mock(Member.class);
        given(owner.getMemberId()).willReturn(ownerId);

        Rating rating = Rating.builder()
                .member(owner)
                .movieId(10L)
                .score(5)
                .comment("주인이 쓴 평점")
                .build();

        given(ratingRepository.findById(ratingId)).willReturn(Optional.of(rating));
        UpdateRatingRequest request = new UpdateRatingRequest(1, "남이 수정 시도");

        // when
        ApiException exception = assertThrows(ApiException.class,
                () -> ratingService.update(otherMemberId, ratingId, request));

        // then
        assertThat(exception.getStatus().value()).isEqualTo(403);
        assertThat(exception.getCode()).isEqualTo("RATING403_1");
        assertThat(rating.getScore()).isEqualTo(5);   // 수정되지 않았는지 확인
    }
}