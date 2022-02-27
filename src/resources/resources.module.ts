import { Module } from '@nestjs/common';
import { ResourceService } from './resources.service';
import { ResourceController } from './resources.controller';

@Module({
  controllers: [ResourceController],
  providers: [ResourceService],
})
export class ResourceModule {}
