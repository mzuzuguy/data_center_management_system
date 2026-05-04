// src/metric-readings/dto/create-metric-reading.dto.ts
export class CreateMetricReadingDto {
  component_id: number;
  metric_type: string;
  metric_value: number;
  metric_unit: string;
  health_status?: string; // optional — defaults to 'OK'
}