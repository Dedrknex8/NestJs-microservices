import { Controller, Post, Req, Body, UseGuards, Param, Get, UseInterceptors, UploadedFile } from '@nestjs/common';
import { JwtAuthGuard } from './guards/auth-guards';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth/users')
export class AppController {
  constructor(
    @Inject('Service_Post') private postClient: ClientProxy,
    @Inject('FILE_SERVICE') private fileClient : ClientProxy,
    private readonly cloudinaryService :  CloudinaryService
  ) {}

  @Get('files')
  @UseGuards(JwtAuthGuard)
  async getallfile(@Req() req){
    const payload = req.user.userId.toString();
    return this.fileClient.send({cmd:'get-all-file'},payload).toPromise()
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createPost(@Req() req, @Body() body: { title: string; content: string }) {
    const user = req.user; 

    const payload = {
      title: body.title,
      content: body.content,
      userId: user.userId,
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
      userId: user.userId,
      username: user.username,
    };

    return this.fileClient.send({ cmd: 'save-file' }, payload);
  }

  @Get('file/:id')
  @UseGuards(JwtAuthGuard)
  async getFileById(@Param('id') id:number){
    const file = await this.fileClient.send({cmd: 'get-file-by-id'},id).toPromise();
    return file
  }

  

}
