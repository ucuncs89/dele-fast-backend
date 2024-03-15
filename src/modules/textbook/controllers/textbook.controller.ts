import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TextbookService } from '../services/textbook.service';
import { CreateTextbookDto } from '../dto/create-textbook.dto';
import { UpdateTextbookDto } from '../dto/update-textbook.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('textbook')
@Controller('textbook')
export class TextbookController {
  constructor(private readonly textbookService: TextbookService) {}

  @Post()
  async create(@Body() createTextbookDto: CreateTextbookDto) {
    const data = await this.textbookService.create(createTextbookDto);
    return { data };
  }

  @Get()
  async findAll() {
    const data = await this.textbookService.findAll();
    return { data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.textbookService.findOne(+id);
    return { data };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTextbookDto: UpdateTextbookDto,
  ) {
    const data = await this.textbookService.update(+id, updateTextbookDto);
    return { data };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.textbookService.remove(+id);
    return { data };
  }
}
