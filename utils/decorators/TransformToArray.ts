import { applyDecorators, BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';

export function StringToArrayTransformer(isObject?: boolean) {
  return Transform(({ value }) => {
    if (!value || value === '') return null;
    if (Array.isArray(value)) return value as string[];
    if (typeof value === 'string') {
      if (isObject) {
        const parsed = JSON.parse(value) as object[] | object;
        if (typeof parsed === 'object') return [parsed];
      }
      return value.split(',');
    }
    throw new BadRequestException('Invalid input type');
  });
}

export const TransformToArray = (isObject?: boolean) => {
  return applyDecorators(StringToArrayTransformer(isObject));
};
