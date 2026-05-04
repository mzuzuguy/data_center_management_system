import { Test, TestingModule } from '@nestjs/testing';
import { MetricReadingsController } from './metric-readings.controller';

describe('MetricReadingsController', () => {
  let controller: MetricReadingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricReadingsController],
    }).compile();

    controller = module.get<MetricReadingsController>(MetricReadingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
