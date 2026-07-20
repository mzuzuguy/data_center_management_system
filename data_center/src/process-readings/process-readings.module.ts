import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessReading } from './entities/process-reading.entity';
import { ProcessReadingsService } from './process-readings.service';
import { ProcessReadingsController } from './process-readings.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([ProcessReading]),
  ],

  controllers: [
    ProcessReadingsController,
  ],

  providers: [
    ProcessReadingsService,
  ],

  exports: [
    ProcessReadingsService,
  ],
})
export class ProcessReadingsModule {}