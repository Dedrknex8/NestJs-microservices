import { Controller, Post, Req, Body, UseGuards, Param, Get } from '@nestjs/common';
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
    const user = req.user; 

    const payload = {
      title: body.title,
      content: body.content,
      userId: user.id,
    };

    return this.postClient.send({ cmd: 'create-post' }, payload);
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
    async getPost(@Param('id') id: string) {
    return this.postClient.send({ cmd: 'get-post' }, { id: parseInt(id) });
  }

}
