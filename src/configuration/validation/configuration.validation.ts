import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { configKeysWithValidation } from '../constants/configuration.constant';
import { ConfigurationDto } from '../dto/configuration.dto';

@ValidatorConstraint({ name: 'ConfigValueValidator', async: false })
export class ConfigValueValidator implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const key = (args.object as ConfigurationDto).key;
    const config = configKeysWithValidation.find(
      (cfg) => cfg.key.toString() === key,
    );
    if (!config) return false;
    if (typeof value !== config.type) return false;
    return config.validation(value);
  }

  defaultMessage() {
    return 'Invalid value for the given configuration key';
  }
}
