import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GetCurrentUser, GetCurrentUserId } from '../auth/decorators';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('me')
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  getMe(@GetCurrentUser() user: User): User {
    return user;
  }

  @Patch('me')
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  updateUser(
    @GetCurrentUserId() userId: number,
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(userId, dto);
  }

  @Delete('me')
  @ApiResponse({ status: 204, description: 'Successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@GetCurrentUserId() userId: number): Promise<void> {
    return this.userService.deleteUser(userId);
  }
}
