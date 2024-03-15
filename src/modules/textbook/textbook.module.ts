import { Module } from '@nestjs/common';
import { TextbookService } from './services/textbook.service';
import { TextbookController } from './controllers/textbook.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TextbookController],
  providers: [TextbookService, PrismaService],
})
export class TextbookModule {}
