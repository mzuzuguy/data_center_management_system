// src/servers/dto/create-server.dto.ts
export class CreateServerDto {
  server_name: string;
  location: string;
  server_type: string; // 'physical' or 'virtual'
  status?: string;     // optional — defaults to 'ACTIVE'
}