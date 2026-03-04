import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StoreRepository } from '../repositories/stores.repository';
import { AddressIdDto } from '../dto/stores.dto';
import { Store } from '@prisma/client';
import { capitalize } from 'utils/string.helper';

@Injectable()
export class StoreValidator {
  constructor(private readonly storeRepo: StoreRepository) {}

  async isExistingNumber(phoneNumber: string, id?: string) {
    const store = await this.storeRepo.findOne({
      user: { phoneNumber },
      ...(id ? { id: { not: id } } : {}),
    });
    if (store) {
      throw new BadRequestException(
        'Phone number already exists for another store',
      );
    }
  }

  validateParams(params: AddressIdDto) {
    if (!params.addressId && (!params.latitude || !params.longitude)) {
      throw new BadRequestException('Invalid params');
    }
  }

  checkStoreLatLong(store?: Store | null) {
    if (!store) {
      throw new NotFoundException('No store found');
    }
    if (!store.latitude || !store.longitude) {
      throw new BadRequestException(
        `Store ${store.name} does not have valid latitude and longitude`,
      );
    }
  }
}
