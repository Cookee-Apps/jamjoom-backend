import { applyDecorators, BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { isDate } from 'class-validator';
/**
 * Transforms a valid date string (like '2025-07-18') to a JavaScript Date object.
 * Returns null for invalid dates or empty inputs.
 */
export function DateTransformer() {
  return Transform(({ value }) => {
    if (!value || value === '') return null;
    if (isDate(value)) return value
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const parsedDate = new Date(value);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
    throw new BadRequestException('Invalid date format. Expected format: yyyy-mm-dd')
    // You can also throw an error or keep as string
  });
}

export const TransformToDate = () => {
  return applyDecorators(
    DateTransformer()
  );
};