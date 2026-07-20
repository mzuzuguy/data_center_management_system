import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProcessReadingsService } from './process-readings.service';

@Controller('process-readings')
export class ProcessReadingsController {
  
  constructor(
    private readonly service: ProcessReadingsService,
  ) {}

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}