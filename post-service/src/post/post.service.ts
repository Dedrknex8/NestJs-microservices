import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../Entity/post.enity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepo: Repository<PostEntity>,

    @Inject('AUTH_SERVICE')
    private authClient: ClientProxy
  ) {}

  async createPost(data: { title: string; content: string; userId: number }) {
    const user = await firstValueFrom(
      this.authClient.send({ cmd: 'get-user' }, data.userId)
    );

    if (!user) throw new Error('User not found');

    const newPost = this.postRepo.create({
      title: data.title,
      content: data.content,
      userId: user.id,
      authorName: user.username,
    });

    const savedPost = await this.postRepo.save(newPost);
    console.log('✅ Post saved:', savedPost);

    return savedPost;
  }
}
