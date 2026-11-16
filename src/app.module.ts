import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { databaseProviders } from './database.provider.js';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { AuthController } from './controller/auth.controller.js';
import { AuthService } from './service/auth.service.js';

import { Member } from './members/entities/member.entity.js';

import { BooksModule } from './books/books.module.js';

import { RentalController } from './rentals/rental.controller.js';
import { RentalService } from './rentals/rental.service.js';
import { RentalRepository } from './rentals/rental.repository.js';

import { MembersModule } from './members/members.module.js';
import { RatingsModule } from './ratings/ratings.module.js';

// 8주차 추가
import { FavoritesModule } from './favorites/favorites.module.js';
import { MovieRecordsModule } from './movie-records/movie-records.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

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

    BooksModule,
    MembersModule,
    RatingsModule,

    // 8주차 추가
    FavoritesModule,
    MovieRecordsModule,
  ],

  controllers: [AppController, RentalController, AuthController],

  providers: [
    ...databaseProviders,
    AppService,
    RentalService,
    RentalRepository,
    AuthService,
  ],

  exports: [...databaseProviders],
})
export class AppModule {}
