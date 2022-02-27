import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ResourceService } from './resources.service';
import { CreateResourceDto, UpdateResourceDto } from './dto';
import { GetCurrentUserId } from '../auth/decorators';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Resource } from '@prisma/client';

@ApiTags('resources')
@Controller('resources')
@ApiBearerAuth()
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.CREATED)
  async createResource(
    @GetCurrentUserId() userId: number,
    @Body() createResourceDto: CreateResourceDto,
  ): Promise<Resource> {
    return this.resourceService.createResource(userId, createResourceDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  async findAllResources(
    @GetCurrentUserId() userId: number,
  ): Promise<Resource[]> {
    return this.resourceService.findAllResources(userId);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @HttpCode(HttpStatus.OK)
  async findOneResourceById(
    @GetCurrentUserId() userId: number,
    @Param('id') resourceId: string,
  ): Promise<Resource> {
    return this.resourceService.findOneResourceById(userId, +resourceId);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @HttpCode(HttpStatus.OK)
  async updateResource(
    @GetCurrentUserId() userId: number,
    @Param('id') resourceId: string,
    @Body() updateResourceDto: UpdateResourceDto,
  ): Promise<Resource> {
    return this.resourceService.updateResource(
      userId,
      +resourceId,
      updateResourceDto,
    );
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'Successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeResource(
    @GetCurrentUserId() userId: number,
    @Param('id') resourceId: string,
  ): Promise<void> {
    return this.resourceService.removeResource(userId, +resourceId);
  }
}
