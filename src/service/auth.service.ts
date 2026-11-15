import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Member } from '../members/entities/member.entity.js';
import { LoginRequestDto } from '../dto/login-request.dto.js';
import { ApiException } from '../exception/api.exception.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginRequestDto) {
    // 1. 이메일로 회원 조회
    const member = await this.memberRepository.findOne({
      where: { email: dto.email },
    });

    if (!member) {
      throw new ApiException(
        HttpStatus.UNAUTHORIZED,
        'AUTH401_1',
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    // 2. 비밀번호 비교
    const isPasswordMatched = await bcrypt.compare(
      dto.password,
      member.password,
    );

    if (!isPasswordMatched) {
      throw new ApiException(
        HttpStatus.UNAUTHORIZED,
        'AUTH401_1',
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    // 3. JWT Access Token 발급
    const accessToken = await this.jwtService.signAsync({
      sub: String(member.memberId),
      email: member.email,
    });

    // 4. 로그인 결과 반환
    return {
      nickname: member.nickname,
      accessToken,
    };
  }
}
