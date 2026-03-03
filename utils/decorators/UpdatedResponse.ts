import { ApiOkResponse } from "@nestjs/swagger";

export const UpdatedResponse = () => ApiOkResponse({ schema: { properties: { updated: { type: 'boolean' } } } })