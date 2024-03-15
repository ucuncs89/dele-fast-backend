import { ApiProperty } from '@nestjs/swagger';

export class CreateTextbookDto {
  @ApiProperty()
  content: string;

  @ApiProperty()
  file_url: string;

  @ApiProperty()
  title: string;
}
