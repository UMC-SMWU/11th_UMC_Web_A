import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FavoriteController } from './favorite.controller.js';
import { FavoriteService } from './favorite.service.js';
import { Favorite } from './entities/favorite.entity.js';
import { Member } from '../members/entities/member.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, Member])],
  controllers: [FavoriteController],
  providers: [FavoriteService],
})
export class FavoritesModule {}
