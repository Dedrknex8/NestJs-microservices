import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from 'src/Entity/post.enity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepo: Repository<PostEntity>,

    @Inject('Auth_Service')
    private authClient: ClientProxy, // 👈 Injected microservice client
  ) {}

  async createPost(data: { title: string; content: string; userId: number }) {
    // Ask auth-service for user info
    const user = await this.authClient
      .send({ cmd: 'get-user' }, data.userId)
      .toPromise();

    if (!user) throw new Error('User not found');

    const newPost = await this.postRepo.create({
      title: data.title,
      content: data.content,
      userId: user.id,
      authorName: user.username,
    });

    return this.postRepo.save(newPost);
  }
}
