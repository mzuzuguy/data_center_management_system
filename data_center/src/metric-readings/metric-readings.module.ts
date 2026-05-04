import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetricReadingsService } from './metric-readings.service';
import { MetricReadingsController } from './metric-readings.controller';
import { MetricReading } from './entities/metric-reading.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MetricReading])],
  controllers: [MetricReadingsController],
  providers: [MetricReadingsService],
  exports: [MetricReadingsService],
})
export class MetricReadingsModule {}