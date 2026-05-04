// src/components/entities/component.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Server } from '../../server/entirties/server.entity';
import { MetricReading } from '../../metric-readings/entities/metric-reading.entity';

@Entity('components')
export class Component {
  @PrimaryGeneratedColumn({ name: 'component_id' })
  component_id: number;

  @Column()
  server_id: number;

  @Column()
  component_type: string; // 'cpu', 'ram', 'disk', 'network'

  @Column({ nullable: true })
  component_name: string;

  @ManyToOne(() => Server, (server) => server.components)
  @JoinColumn({ name: 'server_id' })
  server: Server;

  @OneToMany(() => MetricReading, (reading) => reading.component)
  metric_readings: MetricReading[];
}