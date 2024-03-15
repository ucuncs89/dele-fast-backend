import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from '../dto/create-media.dto';
import { UpdateMediaDto } from '../dto/update-media.dto';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MediaService {
  constructor(private prismaService: PrismaService) {}
  async create(createMediaDto: CreateMediaDto) {
    try {
      const data = await this.prismaService.media.create({
        data: { ...createMediaDto },
      });
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async findAll() {
    return await this.prismaService.media.findMany({});
  }

  async findOne(id: number) {
    const data = await this.prismaService.media.findFirst({ where: { id } });
    if (!data) {
      throw new AppErrorNotFoundException('data not found');
    }
    return data;
  }

  async update(id: number, updateMediaDto: UpdateMediaDto) {
    await this.findOne(id);
    return await this.prismaService.media.update({
      where: { id },
      data: {
        content: updateMediaDto.content,
        title: updateMediaDto.content,
        file_url: updateMediaDto.file_url,
      },
    });
  }

  async remove(id: number) {
    try {
      const data = await this.prismaService.media.delete({ where: { id } });
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
}
