// src/metric-readings/entities/metric-reading.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Component } from '../../component/entities/component.entity';

@Entity('metric_readings')
export class MetricReading {
  @PrimaryGeneratedColumn({ name: 'reading_id' })
  reading_id: number;

  @Column()
  component_id: number;

  @Column()
  metric_type: string; // 'usage', 'temperature', 'latency', 'speed'

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  metric_value: number;

  @Column()
  metric_unit: string; // 'percent', 'celsius', 'ms', 'mbps', 'mb'

  @Column({ default: 'OK' })
  health_status: string; // 'OK', 'WARNING', 'CRITICAL'

  @Column({ type: 'timestamp', default: () => 'SYSTIMESTAMP' })
  recorded_at: Date;

  @ManyToOne(() => Component, (component) => component.metric_readings)
  @JoinColumn({ name: 'component_id' })
  component: Component;
}