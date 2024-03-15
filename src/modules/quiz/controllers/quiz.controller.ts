import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { QuizService } from '../services/quiz.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { SubmitQuizDto } from '../dto/submit-quiz.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('quiz')
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  async findAll() {
    const data = await this.quizService.findAll();
    return { data };
  }

  @Get(':id')
  async findOne(@Req() req, @Param('id') id: string) {
    const data = await this.quizService.findOne(+id, req.user.id);
    return { data };
  }

  @Post(':id/submit')
  async submittQuiz(
    @Req() req,
    @Param('id') id: number,
    @Body() submitQuizDto: SubmitQuizDto,
  ) {
    const data = await this.quizService.submitQuiz(
      +id,
      req.user.id,
      submitQuizDto,
    );
    return { data };
  }

  @Get(':id/questions')
  async getQuizQuestion(@Req() req, @Param('id') id: string) {
    const data = await this.quizService.findQuestions(+id, false, req.user.id);
    return { data };
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
  //   return this.quizService.update(+id, updateQuizDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.quizService.remove(+id);
  // }
}
