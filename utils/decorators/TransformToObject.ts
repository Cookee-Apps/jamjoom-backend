import { applyDecorators, BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';

export function StringToObjectTransformer() {
  return Transform(({ value }) => {
    if (!value || value === '') return null;
    if (typeof value === 'object') return value as object;

    if (typeof value === 'string') {
      return JSON.parse(value) as object;
    }
    throw new BadRequestException('Invalid input type');
  });
}

export const TransformToObject = () => {
  return applyDecorators(StringToObjectTransformer());
};
