import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { databaseProviders } from './database.provider.js';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

// 인증
import { AuthController } from './auth/auth.controller.js';
import { AuthService } from './auth/auth.service.js';

// 회원 Entity
import { Member } from './members/entities/member.entity.js';

// 도메인별 Module
import { MembersModule } from './members/members.module.js';
import { RatingsModule } from './ratings/ratings.module.js';
import { FavoritesModule } from './favorites/favorites.module.js';
import { MovieRecordsModule } from './movie-records/movie-records.module.js';

@Module({
  imports: [
    // 환경변수 설정
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // MySQL 연결
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow<string>('DB_HOST'),
        port: 3306,
        username: configService.getOrThrow<string>('DB_USER'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),
        database: configService.getOrThrow<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    // JWT 인증
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: Number(
            configService.get<string>('JWT_ACCESS_EXPIRATION') ?? 3600,
          ),
        },
      }),
    }),

    TypeOrmModule.forFeature([Member]),

    // 영화 서비스 도메인
    MembersModule,
    RatingsModule,
    FavoritesModule,
    MovieRecordsModule,
  ],

  controllers: [AppController, AuthController],

  providers: [...databaseProviders, AppService, AuthService],

  exports: [...databaseProviders],
})
export class AppModule {}
