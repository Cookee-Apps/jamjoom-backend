// use when boolean key in GET request query
// needed to be converted to boolean
// since it's string

import { Transform } from 'class-transformer';

export function TransformToBoolean() {
  return Transform(({ value }) => {
    return typeof value === 'string' ? value === 'true' : value;
  });
}
