// src/controller/member.controller.ts
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import type { Request } from "express"; // 데코레이터 시그니처에 쓰는 타입은 import type 이어야 합니다
import { CreateMemberDto } from "../dto/create-member.dto";
import { MemberUpdateRequestDto } from "../dto/member-update-request.dto";
import { MemberService } from "../service/member.service";
import { AuthGuard } from "../guard/auth.guard";
import { errorExample, successExample, unauthorizedResponse } from "../swagger/api-example";

const memberInfoExample = {
  email: "challenger@umc.com",
  nickname: "영화조아",
  createdAt: "2026-09-13T21:00:00.000Z",
};

@ApiTags("회원")
@Controller("members")
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @ApiOperation({
    summary: "닉네임 중복 확인",
    description: "회원가입 전에 닉네임을 쓸 수 있는지 확인합니다. 토큰 없이 호출할 수 있는 공개 API입니다.",
  })
  @ApiResponse({ status: 200, description: "확인 성공 (available이 true면 사용 가능)", schema: { example: { available: true } } })
  @Get("nickname/:nickname")
  checkNickname(@Param("nickname") nickname: string) {
    return this.memberService.checkNickname(nickname);
  }

  @ApiOperation({
    summary: "이메일 중복 확인",
    description: "회원가입 전에 이메일을 쓸 수 있는지 확인합니다. 토큰 없이 호출할 수 있는 공개 API입니다.",
  })
  @ApiResponse({ status: 200, description: "확인 성공 (available이 true면 사용 가능)", schema: { example: { available: true } } })
  @Get("email/:email")
  checkEmail(@Param("email") email: string) {
    return this.memberService.checkEmail(email);
  }

  @ApiOperation({
    summary: "회원가입",
    description: "이메일, 비밀번호, 닉네임으로 회원을 등록합니다. 토큰이 없어도 호출할 수 있는 공개 API입니다.",
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() dto: CreateMemberDto) {
    const result = await this.memberService.signUp(dto);
    return {
      isSuccess: true,
      code: "COMMON201",
      message: "회원가입에 성공했습니다.",
      result,
    };
  }

  @ApiOperation({
    summary: "내 정보 조회",
    description: "토큰의 주인인 회원의 이메일, 닉네임, 가입일을 조회합니다.",
  })
  @ApiBearerAuth("bearerAuth")
  @ApiResponse({ status: 200, description: "조회 성공", schema: successExample("COMMON200", "회원 정보를 조회했습니다.", memberInfoExample) })
  @ApiResponse(unauthorizedResponse)
  @ApiResponse({ status: 404, description: "탈퇴 등으로 회원이 없음", schema: errorExample("MEMBER404_1", "해당 회원을 찾을 수 없습니다.") })
  @Get('me')
  @UseGuards(AuthGuard) // 이 줄이 없으면 토큰 없이도 호출됩니다
  async getMyInfo(@Req() request: Request) {
    // Guard가 request["memberId"]에 담아둔 값을 꺼냅니다
    const memberId = request['memberId'] as number;

    const result = await this.memberService.getMyInfo(memberId);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '회원 정보를 조회했습니다.',
      result,
    };
  }

  @ApiOperation({
    summary: "내 정보 수정",
    description: "토큰의 주인인 회원의 닉네임을 바꿉니다. 다른 회원이 쓰는 닉네임으로는 바꿀 수 없습니다.",
  })
  @ApiBearerAuth("bearerAuth")
  @ApiResponse({ status: 200, description: "수정 성공", schema: successExample("COMMON200", "회원 정보를 수정했습니다.", memberInfoExample) })
  @ApiResponse(unauthorizedResponse)
  @ApiResponse({ status: 409, description: "이미 다른 회원이 쓰는 닉네임", schema: errorExample("MEMBER409_1", "이미 사용 중인 닉네임입니다.") })
  @Patch('me')
  @UseGuards(AuthGuard)
  async updateMyInfo(
    @Req() request: Request,
    @Body() dto: MemberUpdateRequestDto,
  ) {
    const memberId = request['memberId'] as number;

    const result = await this.memberService.updateMyInfo(memberId, dto);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '회원 정보를 수정했습니다.',
      result,
    };
  }
}