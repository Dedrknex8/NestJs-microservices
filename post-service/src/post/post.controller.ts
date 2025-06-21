import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PostService } from './post.service';

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @MessagePattern({ cmd: 'create-post' })
  async handleCreatePost(data: { title: string; content: string; userId: number }) {
    return this.postService.createPost(data);
  }
}
