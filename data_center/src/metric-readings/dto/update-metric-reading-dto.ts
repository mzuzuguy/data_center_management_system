// src/metric-readings/dto/update-metric-reading.dto.ts
export class UpdateMetricReadingDto {
  metric_type?: string;
  metric_value?: number;
  metric_unit?: string;
  health_status?: string;
}