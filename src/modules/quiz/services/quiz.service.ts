import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppErrorNotFoundException } from 'src/exceptions/app-exception';
import { SubmitQuizDto } from '../dto/submit-quiz.dto';

@Injectable()
export class QuizService {
  constructor(private prismaService: PrismaService) {}
  async findAll() {
    return await this.prismaService.quiz.findMany();
  }

  async findOne(id: number, user_id: number) {
    const data = await this.prismaService.quiz.findFirst({
      where: { id, response: { every: { user_id } } },
      include: { response: true },
    });
    if (!data) {
      throw new AppErrorNotFoundException('Data Quiz Not Found');
    }
    return data;
  }
  async submitQuiz(
    quiz_id: number,
    user_id: number,
    submitQuizDto: SubmitQuizDto,
  ) {
    const quiz = await this.findOne(quiz_id, user_id);
    const questions = await this.findQuestions(quiz_id, true, user_id);
    let correctCount = 0;

    for (const answer of submitQuizDto.answers) {
      const question = questions.find((q) => q.id === answer.question_id);
      if (question && answer.choice === question.correct_answer) {
        correctCount++;
      }
    }

    const totalCount = submitQuizDto.answers.length;

    // Menghitung passing grade
    const userScore = (correctCount / totalCount) * 100;
    const is_passed = userScore >= quiz.passing_grade;
    const updateQuizResponse = await this.prismaService.quizReponse.upsert({
      create: {
        quiz_id,
        user_id,
        is_passed,
        score: userScore,
      },
      update: { is_passed, score: userScore },
      where: { quiz_id_user_id: { quiz_id, user_id } },
    });
    return { updateQuizResponse, userScore, totalCount };
  }
  async findQuestions(
    quiz_id: number,
    show_correct_answer: boolean = false,
    user_id: number,
  ) {
    await this.findOne(quiz_id, user_id);
    const data = await this.prismaService.questions.findMany({
      select: {
        id: true,
        quiz_id: true,
        title: true,
        correct_answer: show_correct_answer,
        question_answers: {
          select: { id: true, question_id: true, choice: true, title: true },
        },
      },
      where: {
        quiz_id,
      },
    });
    return data;
  }
}
