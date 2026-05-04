// src/metric-readings/metric-readings.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MetricReadingsService } from './metric-readings.service';
import { CreateMetricReadingDto } from './dto/create-metric-reading.dto';
import { UpdateMetricReadingDto } from './dto/update-metric-reading-dto';

@Controller('metric-readings')
export class MetricReadingsController {
  constructor(private readonly metricReadingsService: MetricReadingsService) {}

  @Post()
  create(@Body() createMetricReadingDto: CreateMetricReadingDto) {
    return this.metricReadingsService.create(createMetricReadingDto);
  }

  @Get()
  findAll() {
    return this.metricReadingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.metricReadingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMetricReadingDto: UpdateMetricReadingDto) {
    return this.metricReadingsService.update(+id, updateMetricReadingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.metricReadingsService.remove(+id);
  }
}