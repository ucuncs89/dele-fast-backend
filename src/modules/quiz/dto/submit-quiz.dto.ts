import { ApiProperty } from '@nestjs/swagger';

export class AnswersDto {
  @ApiProperty()
  question_id: number;

  @ApiProperty()
  choice: string;
}
export class SubmitQuizDto {
  @ApiProperty({
    isArray: true,
    type: AnswersDto,
  })
  answers: AnswersDto[];
}
