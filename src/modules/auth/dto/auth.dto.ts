import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class AuthRegisterDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  full_name: string;

  @ApiProperty()
  password: string;
}

export class AuthLoginDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
