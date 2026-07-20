// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServersModule } from './server/server.module';
import { ComponentsModule } from './component/component.module';
import { MetricReadingsModule } from './metric-readings/metric-readings.module';
import { Server } from './server/entirties/server.entity';
import { Component } from './component/entities/component.entity';
import { MetricReading } from './metric-readings/entities/metric-reading.entity';
import { ProcessReading } from './process-readings/entities/process-reading.entity';
import { ProcessReadingsModule } from './process-readings/process-readings.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'data_center_db',
      username: 'postgres',
      password: 'admin_password',
      //schema: 'public',
      entities: [Server, Component, MetricReading, ProcessReading],
      synchronize: true,
    }),
    ServersModule,
    ComponentsModule,
    MetricReadingsModule,
    ProcessReadingsModule,
  ],
})
export class AppModule {}