// src/decorators/swagger.decorator.ts
import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

interface SwaggerOptions {
  summary?: string;
  description?: string;
}

// Metadata keys for storing module info
export const SWAGGER_MODULE_KEY = 'swagger_module';
export const SWAGGER_ROLE_KEY = 'swagger_role';

export function SwaggerAdmin(moduleName: string, options?: SwaggerOptions) {
  const decorators = [
    ApiTags(`admin-${moduleName.toLowerCase()}`),
    SetMetadata(SWAGGER_MODULE_KEY, moduleName),
    SetMetadata(SWAGGER_ROLE_KEY, 'admin'),
  ];

  // Only add ApiOperation for method-level decoration
  // Don't add it for controller-level as it's not compatible
  if (options?.summary || options?.description) {
    return applyDecorators(
      ...decorators,
      ApiOperation({
        summary: options.summary || `Admin ${moduleName} operation`,
        description: options.description,
      }),
    );
  }

  return applyDecorators(...decorators);
}

export function SwaggerCustomer(moduleName: string, options?: SwaggerOptions) {
  const decorators = [
    ApiTags(`customer-${moduleName.toLowerCase()}`),
    SetMetadata(SWAGGER_MODULE_KEY, moduleName),
    SetMetadata(SWAGGER_ROLE_KEY, 'customer'),
  ];

  if (options?.summary || options?.description) {
    return applyDecorators(
      ...decorators,
      ApiOperation({
        summary: options.summary || `Customer ${moduleName} operation`,
        description: options.description,
      }),
    );
  }

  return applyDecorators(...decorators);
}

export function SwaggerStore(moduleName: string, options?: SwaggerOptions) {
  const decorators = [
    ApiTags(`store-${moduleName.toLowerCase()}`),
    SetMetadata(SWAGGER_MODULE_KEY, moduleName),
    SetMetadata(SWAGGER_ROLE_KEY, 'store'),
  ];

  if (options?.summary || options?.description) {
    return applyDecorators(
      ...decorators,
      ApiOperation({
        summary: options.summary || `Store ${moduleName} operation`,
        description: options.description,
      }),
    );
  }

  return applyDecorators(...decorators);
}

export function SwaggerDriver(moduleName: string, options?: SwaggerOptions) {
  const decorators = [
    ApiTags(`driver-${moduleName.toLowerCase()}`),
    SetMetadata(SWAGGER_MODULE_KEY, moduleName),
    SetMetadata(SWAGGER_ROLE_KEY, 'driver'),
  ];

  if (options?.summary || options?.description) {
    return applyDecorators(
      ...decorators,
      ApiOperation({
        summary: options.summary || `Driver ${moduleName} operation`,
        description: options.description,
      }),
    );
  }
  return applyDecorators(...decorators);
}

export function SwaggerShared(
  moduleName: string,
  roles: string[],
  options?: SwaggerOptions,
) {
  const tags = roles.map(
    (role) => `${role.toLowerCase()}-${moduleName.toLowerCase()}`,
  );

  const decorators = [
    ApiTags(...tags),
    SetMetadata(SWAGGER_MODULE_KEY, moduleName),
    SetMetadata(SWAGGER_ROLE_KEY, roles),
  ];

  if (options?.summary || options?.description) {
    return applyDecorators(
      ...decorators,
      ApiOperation({
        summary: options.summary || `${moduleName} operation`,
        description: options.description,
      }),
    );
  }

  return applyDecorators(...decorators);
}
