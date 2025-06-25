import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor (
    @Inject('AUTH_SERVICE') private readonly authClient : ClientProxy,
    @Inject('Service_Post') private readonly postClient : ClientProxy,
    @Inject('FILE_SERVICE') private readonly fileClient : ClientProxy,
  ){}
  
}
