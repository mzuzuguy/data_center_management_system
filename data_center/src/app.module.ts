// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServersModule } from './servers/servers.module';
import { ComponentsModule } from './components/components.module';
import { MetricReadingsModule } from './metric-readings/metric-readings.module';
import { Server } from './servers/entities/server.entity';
import { Component } from './components/entities/component.entity';
import { MetricReading } from './metric-readings/entities/metric-reading.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'oracle',
      host: 'localhost',
      port: 1521,
      serviceName: 'data_center_pdb',
      username: 'pdb_admin',
      password: 'admin_password',
      entities: [Server, Component, MetricReading],
      synchronize: false,
    }),
    ServersModule,
    ComponentsModule,
    MetricReadingsModule,
  ],
})
export class AppModule {}