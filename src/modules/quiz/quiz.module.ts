import { Module } from '@nestjs/common';
import { QuizService } from './services/quiz.service';
import { QuizController } from './controllers/quiz.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [QuizController],
  providers: [PrismaService, QuizService],
})
export class QuizModule {}
