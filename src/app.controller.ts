import { Controller, Post, Req, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/auth-guards';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

@Controller('posts')
export class AppController {
  constructor(
    @Inject('Service_Post') private postClient: ClientProxy
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createPost(@Req() req, @Body() body: { title: string; content: string }) {
    const user = req.user; // this comes from decoded JWT by JwtAuthGuard

    const payload = {
      title: body.title,
      content: body.content,
      userId: user.id,
    };

    return this.postClient.send({ cmd: 'create-post' }, payload);
  }
}
