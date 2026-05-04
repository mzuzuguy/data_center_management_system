// src/components/dto/create-component.dto.ts
export class CreateComponentDto {
  server_id: number;
  component_type: string; // 'cpu', 'ram', 'disk', 'network'
  component_name?: string;
}