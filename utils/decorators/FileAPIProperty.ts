import { ApiProperty } from '@nestjs/swagger';

export const FileAPIProperty = (
  isArray = false,
  name = 'photo',
  required: boolean = false,
) => {
  return ApiProperty({
    required,
    isArray,
    type: 'string',
    format: 'binary',
    description: name,
  });
};
