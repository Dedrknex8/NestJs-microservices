import { Controller, Post, Req, Body, UseGuards, Param, Get, UseInterceptors, UploadedFile } from '@nestjs/common';
import { JwtAuthGuard } from './guards/auth-guards';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class AppController {
  constructor(
    @Inject('Service_Post') private postClient: ClientProxy,
    @Inject('FILE_SERVICE') private fileClient : ClientProxy,
    private readonly cloudinaryService :  CloudinaryService
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

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
    @Body('description') description: string
  ) {
    const user = req.user;

    const uploaded = await this.cloudinaryService.uploadFile(file);

    const payload = {
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
      description,
      userId: user.id,
      username: user.username,
    };

    return this.fileClient.send({ cmd: 'save-file' }, payload);
  }

}
