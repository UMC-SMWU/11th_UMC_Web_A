package com.umc.movie.controller;

import com.umc.movie.entity.Favorite;
import com.umc.movie.entity.Member;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional // 테스트가 끝나면 DB 변경을 롤백해서 테스트끼리 영향을 주지 않는다
class FavoriteApiTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private Member member;
    private String bearer;

    @BeforeEach
    void setUp() {
        member = memberRepository.save(Member.builder()
                .email("challenger@umc.com")
                .password("$2a$10$abcdefghijklmnopqrstuv")
                .nickname("영화조아")
                .build());
        bearer = "Bearer " + jwtUtil.createAccessToken(member.getMemberId(), member.getEmail());
    }

    @Test
    @DisplayName("토큰 없이 즐겨찾기를 등록하면 401이다")
    void createWithoutToken() throws Exception {
        mockMvc.perform(post("/favorites")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\": 550}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("AUTH401_2"));
    }

    @Test
    @DisplayName("토큰이 있으면 즐겨찾기가 등록되고 201이다")
    void createWithToken() throws Exception {
        mockMvc.perform(post("/favorites")
                        .header("Authorization", bearer)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\": 550}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.movieId").value(550));
    }

    @Test
    @DisplayName("이미 즐겨찾기한 영화를 또 등록하면 409이다")
    void createDuplicate() throws Exception {
        favoriteRepository.save(Favorite.builder().member(member).movieId(550L).build());

        mockMvc.perform(post("/favorites")
                        .header("Authorization", bearer)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\": 550}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("FAVORITE409_1"));
    }

    @Test
    @DisplayName("즐겨찾기하지 않은 영화의 상태는 isFavorite false이다")
    void statusNotFavorited() throws Exception {
        mockMvc.perform(get("/favorites/550")
                        .header("Authorization", bearer))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result.isFavorite").value(false));
    }

    @Test
    @DisplayName("API 문서(/v3/api-docs)는 토큰 없이도 열린다")
    void apiDocsIsPublic() throws Exception {
        mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk());
    }
}
