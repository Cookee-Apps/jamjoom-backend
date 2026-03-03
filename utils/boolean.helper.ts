import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export function ConvertToBoolean() {
  return function (target: object, propertyKey: string | symbol) {
    Transform(({ value }) => {
      if (value === 'true' || value === true) return true;
      if (value === 'false' || value === false) return false;
      return value as boolean;
    })(target, propertyKey);

    IsBoolean()(target, propertyKey);
  };
}
