import { Controller, Post, Req, Body, UseGuards, Param, Get, UseInterceptors, UploadedFile, Res, Delete, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './guards/auth-guards';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Controller('auth/users')
export class AppController {
  constructor(
    @Inject('Service_Post') private postClient: ClientProxy,
    @Inject('FILE_SERVICE') private fileClient : ClientProxy,
    private readonly cloudinaryService :  CloudinaryService,
    @Inject(CACHE_MANAGER) private cacheManger : Cache,
  ) {}

  @Get('files')
  @UseGuards(JwtAuthGuard)
  async getallfile(@Req() req){
    const payload = req.user.userId.toString();
    //IT WILL CACHE THE QUERY WITH FILE-1 FILE-2 LIKE THIS
    const cacheKeys = `files-${payload}`;

    //FIRST TRY TO GET FILES FROM CACHE MANAGER
    const cache = await this.cacheManger.get(cacheKeys);

    //IF CACHE FOUND THEN RETURN FROM CACHE
    if(cache){
      return {fromCache:true, data:cache}
    }

    const files = this.fileClient.send({cmd:'get-all-file'},payload).toPromise()
    
    //IF CACHED MISS THEN ADD TO THE CACHE 
    await this.cacheManger.set(cacheKeys,files);

    return {fromCache:false,data:files};
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
      userId: user.userId.toString(),
      username: user.username,
    };

    return this.fileClient.send({ cmd: 'save-file' }, payload);
  }

  @Get('file/:id')
  @UseGuards(JwtAuthGuard)
  async getFileById(@Param('id') id:number){
    const cacheKey = `files-${id}`

    const cached = await this.cacheManger.get(cacheKey);

    if(cacheKey){
      return {fromCache:true, data:cached}
    }
    const file = await this.fileClient.send({cmd: 'get-file-by-id'},id).toPromise();
    
    await this.cacheManger.set(cacheKey, file);

    return {fromCached:false, data:file};
  }



  @Delete('file/delete/:id')
  @UseGuards(JwtAuthGuard)
  async removeFile(@Param('id') id:number,@Req()req){
     try {
    const userId = req.user.userId;
    await this.fileClient
      .send({ cmd: 'delete-file' }, { id, userId })
      .toPromise();

      //INVALID CACHE SO THAT THE DELETE FILE WILL NOT APPEAR AGAIN
      await this.cacheManger.del(`files-${userId}`);
      await this.cacheManger.del(`files-${id}`);

    return { message: 'File successfully deleted' };
  } catch (err) {
    console.error('Microservice error:', err);

    if (err?.response?.statusCode === 401) {
      throw new UnauthorizedException(err.response.message);
    }

    throw new InternalServerErrorException('Something went wrong');
  }
  }
  


  
  

}
