import { Test, TestingModule } from '@nestjs/testing';
import { MetricReadingsService } from './metric-readings.service';

describe('MetricReadingsService', () => {
  let service: MetricReadingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetricReadingsService],
    }).compile();

    service = module.get<MetricReadingsService>(MetricReadingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
