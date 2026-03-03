import { ApiOkResponse } from "@nestjs/swagger";

export const CreatedResponse = () => ApiOkResponse({ schema: { properties: { id: { type: 'string' } } } })