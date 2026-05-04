import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server } from './entities/server.entity';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';

@Injectable()
export class ServersService {
  constructor(
    @InjectRepository(Server)
    private serversRepository: Repository<Server>,
  ) {}

  // Create a new server
  create(createServerDto: CreateServerDto): Promise<Server> {
    const server = this.serversRepository.create(createServerDto);
    return this.serversRepository.save(server);
  }

  // Get all servers
  findAll(): Promise<Server[]> {
    return this.serversRepository.find();
  }

  // Get one server by id
  async findOne(id: number): Promise<Server> {
    const server = await this.serversRepository.findOne({
      where: { server_id: id },
    });
    if (!server) {
      throw new NotFoundException(`Server with id ${id} not found`);
    }
    return server;
  }

  // Update a server
  async update(id: number, updateServerDto: UpdateServerDto): Promise<Server> {
    const server = await this.findOne(id);
    Object.assign(server, updateServerDto);
    return this.serversRepository.save(server);
  }

  // Delete a server
  async remove(id: number): Promise<void> {
    const server = await this.findOne(id);
    await this.serversRepository.remove(server);
  }
}