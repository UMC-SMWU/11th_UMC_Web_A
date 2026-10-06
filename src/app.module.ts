import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { databaseProviders } from './database.provider.js';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { BooksModule } from './books/books.module.js';

import { RentalController } from './rentals/rental.controller.js';
import { RentalService } from './rentals/rental.service.js';
import { RentalRepository } from './rentals/rental.repository.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // TypeORM으로 MySQL 연결
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

    // Book 관련 기능
    BooksModule,
  ],

  controllers: [
    AppController,

    // BookController는 BooksModule로 이동했으므로 여기서 제거
    RentalController,
  ],

  providers: [
    ...databaseProviders,

    AppService,

    // BookService, BookRepository도 BooksModule로 이동
    RentalService,
    RentalRepository,
  ],

  exports: [...databaseProviders],
})
export class AppModule {}
