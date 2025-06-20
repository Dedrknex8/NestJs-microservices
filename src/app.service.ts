import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor (
    @Inject('Service_Auth') private readonly authClient : ClientProxy,
    @Inject('Service_Post') private readonly postClient : ClientProxy
  ){}
  
}
