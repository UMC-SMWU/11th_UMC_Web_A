import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Member } from './entities/member.entity.js';
import { MemberController } from './member.controller.js';
import { MemberService } from './member.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MembersModule {}
