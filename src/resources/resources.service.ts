import { Injectable, NotFoundException } from '@nestjs/common';
import { Resource } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResourceDto, UpdateResourceDto } from './dto';

@Injectable()
export class ResourceService {
  constructor(private prisma: PrismaService) {}

  async createResource(
    userId: number,
    createResourceDto: CreateResourceDto,
  ): Promise<Resource> {
    const resource = this.prisma.resource.create({
      data: {
        ownerId: userId,
        ...createResourceDto,
      },
    });

    return resource;
  }

  async findAllResources(userId: number): Promise<Resource[]> {
    return this.prisma.resource.findMany({
      where: {
        ownerId: userId,
      },
    });
  }

  async findOneResourceById(
    userId: number,
    resourceId: number,
  ): Promise<Resource> {
    const resource = await this.prisma.resource.findFirst({
      where: {
        ownerId: userId,
        id: resourceId,
      },
    });

    if (!resource) throw new NotFoundException('Resource not found');

    return resource;
  }

  async updateResource(
    userId: number,
    resourceId: number,
    updateResourceDto: UpdateResourceDto,
  ): Promise<Resource> {
    const resource = await this.prisma.resource.findFirst({
      where: {
        id: resourceId,
        ownerId: userId,
      },
    });

    if (!resource) throw new NotFoundException('Resource not found');

    return this.prisma.resource.update({
      where: {
        id: resourceId,
      },
      data: {
        ...updateResourceDto,
      },
    });
  }

  async removeResource(userId: number, resourceId: number): Promise<void> {
    const resource = await this.prisma.resource.findFirst({
      where: {
        id: resourceId,
        ownerId: userId,
      },
    });

    if (!resource) throw new NotFoundException('Resource not found');

    await this.prisma.resource.delete({
      where: {
        id: resourceId,
      },
    });
  }
}
