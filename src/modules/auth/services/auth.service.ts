import { Injectable } from '@nestjs/common';
import { AuthLoginDto, AuthRegisterDto } from '../dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SaltOrRounds } from 'src/constant/SaltOrRounds';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { JwtService } from '@nestjs/jwt';
import { env } from 'process';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtTokenService: JwtService,
  ) {}
  async register(authRegisterDto: AuthRegisterDto) {
    const usersExists = await this.prismaService.user.findFirst({
      where: {
        email: authRegisterDto.email,
      },
      select: { id: true, email: true },
    });
    const passwordHash = await bcrypt.hash(
      authRegisterDto.password,
      SaltOrRounds,
    );
    if (usersExists) {
      throw new AppErrorException('Email already exists');
    }
    try {
      const data = await this.prismaService.user.create({
        data: {
          ...authRegisterDto,
          password: passwordHash,
        },
      });
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async login(authLoginDto: AuthLoginDto) {
    const users = await this.prismaService.user.findFirst({
      where: {
        email: authLoginDto.email,
      },
    });
    if (!users) {
      throw new AppErrorNotFoundException("User doesn't exist");
    }
    const passwordMatch = await bcrypt.compare(
      authLoginDto.password,
      users.password,
    );
    if (!passwordMatch) {
      throw new AppErrorNotFoundException("Password doesn't match");
    }
    try {
      const payloadJwt = { id: users.id, email: users.email, sub: users.id };
      const token = this.jwtTokenService.sign(payloadJwt, {
        secret: env.JWT_SECRET_KEY,
        expiresIn: env.JWT_EXPIRED,
      });

      return {
        token,
        expired_token: new Date(
          new Date().setDate(new Date().getDate() + 1),
        ).toISOString(),
      };
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
}
