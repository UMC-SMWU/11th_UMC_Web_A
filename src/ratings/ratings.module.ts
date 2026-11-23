import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Member } from '../members/entities/member.entity.js';
import { Rating } from './entities/rating.entity.js';

import { RatingController } from './rating.controller.js';
import { RatingService } from './rating.service.js';
import { AuthGuard } from '../common/guard/auth.guard.js';

@Module({
  imports: [TypeOrmModule.forFeature([Member, Rating])],

  controllers: [RatingController],

  providers: [RatingService, AuthGuard],

  exports: [RatingService],
})
export class RatingsModule {}
