
package com.umc.movie.service;

import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RatingServiceTest {

    @Mock
    private RatingRepository ratingRepository;

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private RatingService ratingService;

    private Member member;

    @BeforeEach
    void setUp() {
        member = mock(Member.class);
    }

    @Test
    @DisplayName("같은 영화에 평점을 중복 등록하면 409와 RATING409_1 예외가 발생한다")
    void createRatingWhenDuplicated() {
        // given: 이미 평점을 등록한 회원
        Long memberId = 1L;
        Long movieId = 550L;
        CreateRatingRequest request =
                new CreateRatingRequest(movieId, 5, "재미있는 영화");

        when(memberRepository.findById(memberId))
                .thenReturn(Optional.of(member));

        when(ratingRepository.existsByMember_MemberIdAndMovieId(
                memberId, movieId
        )).thenReturn(true);

        // when: 같은 영화에 평점을 다시 등록
        ApiException exception = assertThrows(
                ApiException.class,
                () -> ratingService.create(memberId, request)
        );

        // then: 중복 평점 오류 확인
        assertEquals("RATING409_1", exception.getCode());
        assertEquals(HttpStatus.CONFLICT, exception.getStatus());

        // 중복이면 DB에 저장하지 않아야 함
        verify(ratingRepository, never()).save(any(Rating.class));
    }

    @Test
    @DisplayName("다른 회원의 평점을 수정하면 403과 RATING403_1 예외가 발생한다")
    void updateRatingOfAnotherMember() {
        // given: 평점 작성자와 수정 요청자가 다름
        Long ownerId = 1L;
        Long otherMemberId = 2L;
        Long ratingId = 10L;

        Member owner = mock(Member.class);
        when(owner.getMemberId()).thenReturn(ownerId);

        Rating rating = mock(Rating.class);
        when(rating.getMember()).thenReturn(owner);

        when(ratingRepository.findById(ratingId))
                .thenReturn(Optional.of(rating));

        UpdateRatingRequest request =
                new UpdateRatingRequest(4, "수정하려는 후기");

        // when: 다른 회원이 평점 수정을 요청
        ApiException exception = assertThrows(
                ApiException.class,
                () -> ratingService.update(
                        otherMemberId, ratingId, request
                )
        );

        // then: 권한 없음 오류 확인
        assertEquals("RATING403_1", exception.getCode());
        assertEquals(HttpStatus.FORBIDDEN, exception.getStatus());

        // 권한이 없으므로 저장하지 않아야 함
        verify(ratingRepository, never()).saveAndFlush(any(Rating.class));
    }
}
