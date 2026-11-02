import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Member } from '../members/entities/member.entity.js';
import { Rating } from './entities/rating.entity.js';

import { RatingController } from './controller/rating.controller.js';
import { RatingService } from '../service/rating.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Rating, Member])],

  controllers: [RatingController],

  providers: [RatingService],
})
export class RatingsModule {}
