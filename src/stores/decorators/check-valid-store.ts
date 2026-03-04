import { Injectable } from '@nestjs/common';
import {
  isUUID,
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ValidationOptions } from 'joi';
import { StoreService } from '../service/stores.service';

// user-exists.validator.ts
@ValidatorConstraint({ async: true })
@Injectable()
export class StoreExistsValidator implements ValidatorConstraintInterface {
  constructor(private readonly storeService: StoreService) {}

  async validate(storeId: string): Promise<boolean> {
    if (!isUUID(storeId)) return false;
    const store = await this.storeService.findStoreById(storeId);
    return !!store;
  }

  defaultMessage(): string {
    return 'Invalid store id';
  }
}

export function IsValidStore(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsValidStore',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: StoreExistsValidator,
    });
  };
}
