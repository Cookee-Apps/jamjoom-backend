import { Type } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max } from 'class-validator';

export const ConvertToNumber = () => Type(() => Number);
export const ConvertToDecimal = () => Type(() => Decimal);

export const Limit = () =>
  applyDecorators(ApiProperty({ default: 10 }), IsNumber(), ConvertToNumber());

export const Skip = () =>
  applyDecorators(ApiProperty({ default: 0 }), IsNumber(), ConvertToNumber());

export const OptionalDecimal = (example?: number) =>
  applyDecorators(
    ApiPropertyOptional({
      type: Number,
      example: example,
    }),
    IsOptional(),
    ConvertToDecimal(),
  );

type AnyObject = Record<string, unknown>;

export function calculatePercentages<T extends AnyObject, K extends keyof T>(
  data: T[],
  fieldPath: string,
  labelKey: K = 'status' as K,
): Array<{ [P in K]: T[P] } & { count: number; percentage: string }> {
  const getValue = (obj: AnyObject, path: string): number => {
    const keys = path.split('.');
    let result: unknown = obj;

    for (const key of keys) {
      if (typeof result === 'object' && result !== null && key in result) {
        result = (result as AnyObject)[key];
      } else {
        return 0;
      }
    }

    return typeof result === 'number' ? result : 0;
  };

  const total = data.reduce((sum, item) => {
    return sum + getValue(item, fieldPath)
  }, 0);

  return data.map((item) => {
    const count = getValue(item, fieldPath);
    const percentage = total ? ((count / total) * 100).toFixed(2) : '0.00';

    return {
      [labelKey]: item[labelKey],
      count,
      percentage: `${percentage}%`,
      ...item,
    } as { [P in K]: T[P] } & { count: number; percentage: string };
  });
}
