import {
  CanActivate,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { StoreService } from '../service/stores.service';
import { RequestWithUser } from 'src/auth/types/request_with_user';
import { error_messages } from '../constants/store.constants';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class StoreGuard implements CanActivate {
  constructor(
    private readonly storeService: StoreService,
    @Inject(REQUEST) private readonly request: RequestWithUser,
  ) {}

  async canActivate(): Promise<boolean> {
    const userId = this.request.user.id;
    if (!userId) throw new InternalServerErrorException();
    const store = await this.storeService.findStoreByUserId(userId);
    if (!store)
      throw new InternalServerErrorException(error_messages.storeNotFound);
    if (!store.user.active)
      throw new InternalServerErrorException(error_messages.storeBlocked);
    this.request['store'] = store;
    return true;
  }
}
