import { ApiProperty } from '@nestjs/swagger';

export class CreateMediaDto {
  @ApiProperty()
  content: string;

  @ApiProperty()
  file_url: string;

  @ApiProperty()
  title: string;
}
