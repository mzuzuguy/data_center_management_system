import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('process_readings')
export class ProcessReading {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  server_id: number;

  @Column()
  process_name: string;

  @Column()
  pid: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  cpu_usage: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  memory_usage: number;

  @CreateDateColumn()
  recorded_at: Date;
}