import { randomUUID } from 'node:crypto';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { loadEnv } from 'vite';
import request from 'supertest';
import { DataSource, Repository } from 'typeorm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { RatingController } from '../src/ratings/rating.controller.js';
import { RatingService } from '../src/ratings/rating.service.js';
import { Rating } from '../src/ratings/entities/rating.entity.js';
import { Member } from '../src/members/entities/member.entity.js';
import { HttpExceptionFilter } from '../src/filter/http-exception.filter.js';
import { AuthGuard } from '../src/common/guard/auth.guard.js';

// 테스트 환경변수 불러오기
const testEnv = loadEnv('test', process.cwd(), 'TEST_');

// 개발 DB에 잘못 연결되지 않도록 검증
if (testEnv.TEST_DB_NAME !== 'umc_movie_test') {
  throw new Error('테스트 전용 DB가 아닙니다. TEST_DB_NAME을 확인하세요.');
}

describe('평점 API 통합 테스트', () => {
  let app: INestApplication | undefined;
  let dataSource: DataSource;

  let memberRepository: Repository<Member>;
  let ratingRepository: Repository<Rating>;

  let member: Member | undefined;
  let authorization: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        // 테스트 전용 MySQL 연결
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: testEnv.TEST_DB_HOST,
          port: Number(testEnv.TEST_DB_PORT || 3306),
          username: testEnv.TEST_DB_USER,
          password: testEnv.TEST_DB_PASSWORD,
          database: testEnv.TEST_DB_NAME,
          entities: [Member, Rating],
          synchronize: false,
          retryAttempts: 0,
        }),

        TypeOrmModule.forFeature([Member, Rating]),

        // 테스트용 JWT 설정
        JwtModule.register({
          global: true,
          secret: 'test-secret-for-e2e-only',
          signOptions: {
            expiresIn: 3600,
          },
        }),
      ],

      controllers: [RatingController],

      providers: [RatingService, AuthGuard],
    }).compile();

    app = moduleFixture.createNestApplication();

    // 실제 main.ts와 동일한 검증 설정
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();

    // 실제 연결된 DB 확인
    dataSource = moduleFixture.get(DataSource);

    const rows: Array<{ dbName: string }> = await dataSource.query(
      'SELECT DATABASE() AS dbName',
    );

    if (rows[0]?.dbName !== 'umc_movie_test') {
      throw new Error('테스트 DB 연결 검증에 실패했습니다.');
    }

    memberRepository = moduleFixture.get<Repository<Member>>(
      getRepositoryToken(Member),
    );

    ratingRepository = moduleFixture.get<Repository<Rating>>(
      getRepositoryToken(Rating),
    );

    // 테스트 전용 회원 생성
    const uniqueId = randomUUID().replace(/-/g, '');

    member = await memberRepository.save(
      memberRepository.create({
        email: `rating-${uniqueId}@example.com`,
        password: 'test-password',
        nickname: `test-${uniqueId.slice(0, 12)}`,
      }),
    );

    // 테스트 JWT 발급
    const jwtService = moduleFixture.get(JwtService);

    const token = jwtService.sign({
      sub: String(member.memberId),
      email: member.email,
    });

    authorization = `Bearer ${token}`;
  }, 20000);

  // ========================================
  // 테스트 1. JWT 인증 실패
  // ========================================

  it('토큰 없이 POST /ratings 요청 시 401과 AUTH401_2를 반환한다', async () => {
    // Given: Authorization 헤더가 없는 요청

    // When: 평점 등록 API 호출
    const response = await request(app!.getHttpServer())
      .post('/ratings')
      .send({
        movieId: 550,
        score: 5,
        comment: '인증 없는 요청',
      })
      .expect(401);

    // Then: 인증 실패 응답 검증
    expect(response.body.isSuccess).toBe(false);
    expect(response.body.code).toBe('AUTH401_2');
  });

  // ========================================
  // 테스트 2. JWT 인증 후 평점 등록
  // ========================================

  it('정상 JWT로 POST /ratings 요청 시 201과 COMMON201을 반환한다', async () => {
    // Given: 정상 JWT를 발급받은 회원

    // When: Authorization 헤더와 함께 평점 등록
    const response = await request(app!.getHttpServer())
      .post('/ratings')
      .set('Authorization', authorization)
      .send({
        movieId: 550,
        score: 5,
        comment: '정상 등록 테스트',
      })
      .expect(201);

    // Then: 등록 성공 응답 검증
    expect(response.body.isSuccess).toBe(true);
    expect(response.body.code).toBe('COMMON201');
    expect(Number(response.body.result.movieId)).toBe(550);
  });

  // ========================================
  // 테스트 데이터 정리
  // ========================================

  afterAll(async () => {
    try {
      // 테스트 회원이 작성한 평점만 삭제
      if (member && ratingRepository) {
        const testRatings = await ratingRepository.find({
          where: {
            member: { memberId: member.memberId },
          },
        });

        if (testRatings.length > 0) {
          await ratingRepository.remove(testRatings);
        }
      }

      // 테스트용 회원 삭제
      if (member && memberRepository) {
        await memberRepository.remove(member);
      }
    } finally {
      if (app) {
        await app.close();
      }
    }
  });
});
