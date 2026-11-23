// test/rating.e2e-spec.ts
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Repository } from 'typeorm';
import { RatingController } from '../src/controller/rating.controller';
import { Member } from '../src/entity/member.entity';
import { Rating } from '../src/entity/rating.entity';
import { HttpExceptionFilter } from '../src/filter/http-exception.filter';
import { RatingService } from '../src/service/rating.service';

describe('평점 API (통합 테스트)', () => {
  let app: INestApplication;
  let ratingRepository: Repository<Rating>;
  let authorization: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        // 개발용 MySQL 대신 테스트가 돌 때만 메모리 위에 만들어지는 DB를 씁니다.
        TypeOrmModule.forRoot({
          type: 'sqljs',
          autoSave: false,
          entities: [Member, Rating],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Member, Rating]),
        JwtModule.register({
          global: true,
          secret: 'test-secret-for-e2e-only',
          signOptions: { expiresIn: 3600 },
        }),
      ],
      controllers: [RatingController],
      providers: [RatingService],
    }).compile();

    app = moduleFixture.createNestApplication();

    // main.ts의 전역 설정은 테스트 앱에 자동으로 따라오지 않아서 다시 붙입니다.
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();

    const memberRepository = moduleFixture.get<Repository<Member>>(getRepositoryToken(Member));
    ratingRepository = moduleFixture.get(getRepositoryToken(Rating));

    // 로그인한 회원이 있어야 하므로 회원을 한 명 저장하고 토큰을 직접 발급합니다.
    const member = await memberRepository.save(
      memberRepository.create({
        email: 'challenger@umc.com',
        password: '$2b$10$abcdefghijklmnopqrstuv', // 로그인 API를 거치지 않으므로 아무 값이나 괜찮습니다
        nickname: '영화조아',
      }),
    );

    const jwtService = moduleFixture.get(JwtService);
    const token = jwtService.sign({ sub: String(member.memberId), email: member.email });
    authorization = `Bearer ${token}`;
  });

  beforeEach(async () => {
    // 앞 테스트가 남긴 평점을 지워서 테스트끼리 서로 영향을 주지 않게 합니다.
    await ratingRepository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  it('토큰 없이 평점을 등록하면 401과 AUTH401_2를 응답한다', async () => {
    const response = await request(app.getHttpServer())
      .post('/ratings')
      .send({ movieId: 550, score: 5, comment: '다시 봐도 좋은 영화' })
      .expect(401);

    expect(response.body.isSuccess).toBe(false);
    expect(response.body.code).toBe('AUTH401_2');
  });

  it('토큰을 담아 평점을 등록하면 201과 저장된 평점을 응답한다', async () => {
    const response = await request(app.getHttpServer())
      .post('/ratings')
      .set('Authorization', authorization)
      .send({ movieId: 550, score: 5, comment: '다시 봐도 좋은 영화' })
      .expect(201);

    expect(response.body.code).toBe('COMMON201');
    expect(response.body.result.movieId).toBe(550);
    expect(response.body.result.score).toBe(5);
  });
});