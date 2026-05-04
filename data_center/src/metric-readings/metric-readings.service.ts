// src/metric-readings/metric-readings.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetricReading } from './entities/metric-reading.entity';
import { CreateMetricReadingDto } from './dto/create-metric-reading.dto';
import { UpdateMetricReadingDto } from './dto/update-metric-reading-dto';

@Injectable()
export class MetricReadingsService {
  constructor(
    @InjectRepository(MetricReading)
    private metricReadingsRepository: Repository<MetricReading>,
  ) {}

  create(createMetricReadingDto: CreateMetricReadingDto): Promise<MetricReading> {
    const reading = this.metricReadingsRepository.create(createMetricReadingDto);
    return this.metricReadingsRepository.save(reading);
  }

  findAll(): Promise<MetricReading[]> {
    return this.metricReadingsRepository.find({
      relations: ['component'], // also return the component it belongs to
    });
  }

  async findOne(id: number): Promise<MetricReading> {
    const reading = await this.metricReadingsRepository.findOne({
      where: { reading_id: id },
      relations: ['component'],
    });
    if (!reading) {
      throw new NotFoundException(`Metric reading with id ${id} not found`);
    }
    return reading;
  }

  async update(id: number, updateMetricReadingDto: UpdateMetricReadingDto): Promise<MetricReading> {
    const reading = await this.findOne(id);
    Object.assign(reading, updateMetricReadingDto);
    return this.metricReadingsRepository.save(reading);
  }

  async remove(id: number): Promise<void> {
    const reading = await this.findOne(id);
    await this.metricReadingsRepository.remove(reading);
  }
}