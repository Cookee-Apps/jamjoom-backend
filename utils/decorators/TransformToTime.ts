import { applyDecorators, BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';
import dateHelper from 'utils/date.helper';

type TimeTransformerOptionsT = {
  optional?: boolean;
  convertToTimeZoneUtc?: boolean;
};

/**
 * Transforms a valid time string (e.g., '14:30') into a JavaScript Date object set to today.
 * Returns null for invalid times or empty input.
 */
export function TimeTransformer({
  optional = false,
  convertToTimeZoneUtc = true,
}: TimeTransformerOptionsT = {}) {
  return Transform(({ value }) => {
    if (value instanceof Date) return value;

    if (typeof value === 'string' && /^\d{2}:\d{2}$/.test(value)) {
      const [hours, minutes] = value.split(':').map(Number);

      if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
        return dateHelper.convertAnyDateToNativeDate(
          value,
          false,
          false,
          'HH:mm',
          convertToTimeZoneUtc,
        );
        // const now = new Date();
        // now.setHours(hours, minutes, 0, 0);
        // return now;
      }
    }
    if (optional) return null;
    throw new BadRequestException('Invalid time format'); // or throw an error if stricter validation is needed
  });
}

export const TransformToTime = (options?: TimeTransformerOptionsT) => {
  return applyDecorators(IsDate(), TimeTransformer(options));
};
