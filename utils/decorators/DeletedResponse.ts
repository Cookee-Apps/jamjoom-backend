import { ApiOkResponse } from '@nestjs/swagger';

export const DeletedResponse = () =>
  ApiOkResponse({
    schema: { properties: { deleted: { default: true, type: 'boolean' } } },
  });
