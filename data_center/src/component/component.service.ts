// src/components/components.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Component } from './entities/component.entity';
import { CreateComponentDto } from './dto/create-coponent.dto';
import { UpdateComponentDto } from './dto/update-component.dto';

@Injectable()
export class ComponentsService {
  constructor(
    @InjectRepository(Component)
    private componentsRepository: Repository<Component>,
  ) {}

  create(createComponentDto: CreateComponentDto): Promise<Component> {
    const component = this.componentsRepository.create(createComponentDto);
    return this.componentsRepository.save(component);
  }

  findAll(): Promise<Component[]> {
    return this.componentsRepository.find({
      relations: ['server'], // also return the server it belongs to
    });
  }

  async findOne(id: number): Promise<Component> {
    const component = await this.componentsRepository.findOne({
      where: { component_id: id },
      relations: ['server'],
    });
    if (!component) {
      throw new NotFoundException(`Component with id ${id} not found`);
    }
    return component;
  }

  async update(id: number, updateComponentDto: UpdateComponentDto): Promise<Component> {
    const component = await this.findOne(id);
    Object.assign(component, updateComponentDto);
    return this.componentsRepository.save(component);
  }

  async remove(id: number): Promise<void> {
    const component = await this.findOne(id);
    await this.componentsRepository.remove(component);
  }
}