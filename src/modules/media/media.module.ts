import { Module } from '@nestjs/common';
import { MediaService } from './services/media.service';
import { MediaController } from './controllers/media.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MediaController],
  providers: [PrismaService, MediaService],
})
export class MediaModule {}
