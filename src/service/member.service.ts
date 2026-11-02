import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateMemberDto } from '../dto/create-member.dto.js';
import { Member } from '../members/entities/member.entity.js';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  // 이메일 중복 확인
  async checkEmail(email: string) {
    const member = await this.memberRepository.findOneBy({ email });
    return { isAvailable: !member };
  }

  // 닉네임 중복 확인
  async checkNickname(nickname: string) {
    const member = await this.memberRepository.findOneBy({ nickname });
    return { isAvailable: !member };
  }

  // 회원가입
  async signUp(dto: CreateMemberDto) {
    const existingEmail = await this.memberRepository.findOneBy({
      email: dto.email,
    });

    if (existingEmail) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }

    const existingNickname = await this.memberRepository.findOneBy({
      nickname: dto.nickname,
    });

    if (existingNickname) {
      throw new ConflictException('이미 사용 중인 닉네임입니다.');
    }

    const savedMember = await this.memberRepository.save(
      this.memberRepository.create({
        email: dto.email,
        password: await bcrypt.hash(dto.password, 10),
        nickname: dto.nickname,
      }),
    );

    return {
      memberId: savedMember.memberId,
      email: savedMember.email,
      nickname: savedMember.nickname,
    };
  }
}
