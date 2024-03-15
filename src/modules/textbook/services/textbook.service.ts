import { Injectable } from '@nestjs/common';
import { CreateTextbookDto } from '../dto/create-textbook.dto';
import { UpdateTextbookDto } from '../dto/update-textbook.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';

@Injectable()
export class TextbookService {
  constructor(private prismaService: PrismaService) {}
  async create(createTextbookDto: CreateTextbookDto) {
    try {
      const data = await this.prismaService.textbook.create({
        data: { ...createTextbookDto },
      });
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async findAll() {
    return await this.prismaService.textbook.findMany({});
  }

  async findOne(id: number) {
    const data = await this.prismaService.textbook.findFirst({ where: { id } });
    if (!data) {
      throw new AppErrorNotFoundException('data not found');
    }
    return data;
  }

  async update(id: number, updateTextbookDto: UpdateTextbookDto) {
    await this.findOne(id);
    return await this.prismaService.textbook.update({
      where: { id },
      data: {
        content: updateTextbookDto.content,
        title: updateTextbookDto.content,
        file_url: updateTextbookDto.file_url,
      },
    });
  }

  async remove(id: number) {
    return await this.prismaService.textbook.delete({ where: { id } });
  }
}
