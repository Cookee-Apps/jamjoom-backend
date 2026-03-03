import { getSchemaPath } from '@nestjs/swagger';

export function customizeDtoSchemaForSwagger(
  dto: new (...args: any[]) => object,
  exampleOverrides: Record<string, string | number | null> = {},
  omitKeys: string[] = [],
) {
  const overriddenProperties = Object.entries(exampleOverrides).reduce(
    (acc, [key, value]) => {
      if (!omitKeys.includes(key)) {
        acc[key] = { example: value };
      }
      return acc;
    },
    {} as Record<string, any>,
  );

  const omittedProperties = omitKeys.reduce(
    (acc, key) => {
      acc[key] = { readOnly: true }; // readOnly removes it from "required"
      return acc;
    },
    {} as Record<string, any>,
  );

  return {
    schema: {
      allOf: [
        { $ref: getSchemaPath(dto) },
        {
          properties: {
            ...overriddenProperties,
            ...omittedProperties,
          },
        },
      ],
    },
  };
}
