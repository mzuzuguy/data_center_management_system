// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServersModule } from './server/server.module';
import { ComponentsModule } from './component/component.module';
import { MetricReadingsModule } from './metric-readings/metric-readings.module';
import { Server } from './server/entirties/server.entity';
import { Component } from './component/entities/component.entity';
import { MetricReading } from './metric-readings/entities/metric-reading.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'oracle',
      connectString: 'localhost:1521/data_center_pdb',
      username: 'pdb_admin',
      password: 'admin_password',
      //schema: 'PDB_ADMIN',
      entities: [Server, Component, MetricReading],
      synchronize: false,
    }),
    ServersModule,
    ComponentsModule,
    MetricReadingsModule,
  ],
})
export class AppModule {}