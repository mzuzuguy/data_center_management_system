// src/servers/entities/server.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Component } from '../../component/entities/component.entity';

@Entity('servers')
export class Server {
  @PrimaryGeneratedColumn({ name: 'server_id' })
  server_id: number;

  @Column()
  server_name: string;

  @Column()
  location: string;

  @Column()
  server_type: string; // 'physical' or 'virtual'

  @Column({ default: 'ACTIVE' })
  status: string; // 'ACTIVE', 'DOWN', 'MAINTENANCE'

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  registered_at: Date;

  @OneToMany(() => Component, (component) => component.server)
  components: Component[];
}