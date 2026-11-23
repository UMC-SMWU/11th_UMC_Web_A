// src/dto/update-rating.dto.ts
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, Max, MaxLength, Min } from "class-validator";

export class UpdateRatingDto {
  @ApiProperty({ description: "바꿀 별점 (1~5 정수)", example: 4, minimum: 1, maximum: 5 })
  @IsInt({ message: "별점은 정수여야 합니다." })
  @Min(1, { message: "별점은 1점 이상이어야 합니다." })
  @Max(5, { message: "별점은 5점 이하여야 합니다." })
  score: number;

  @ApiPropertyOptional({ description: "바꿀 후기 (선택, 500자 이하)", example: "두 번째 보니 조금 아쉬웠어요" })
  @IsOptional()
  @MaxLength(500, { message: "후기는 500자 이하로 입력해주세요." })
  comment?: string;
}