import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PostService } from './post.service';
import { CreatePostDto } from '../DTO/create-post.dto';
import { PostEntity } from '../Entity/post.enity';

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}
  
  @MessagePattern({ cmd: 'create-post' })
  async handleCreatePost(data: CreatePostDto & {userId : number}) {
    console.log('Recived messsage')
    return this.postService.createPost(data);
  }

  @MessagePattern({ cmd: 'get-post' })
  async findOne(@Payload() data: { id: number }): Promise<PostEntity> {
    return this.postService.getPostById(data.id);
  }
}

