import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

interface SwaggerDocument extends OpenAPIObject { }

function cleanTagName(tagName: string): string {
  return tagName
    .replace(/^(admin|customer|store)-/, '')
    .replace(/-/g, ' ');
}

function filterDocumentByTagPrefix(
  document: SwaggerDocument,
  prefix: string,
): SwaggerDocument {
  const filtered: SwaggerDocument = {
    ...document,
    paths: {},
    tags: [],
  };

  filtered.tags =
    document.tags
      ?.filter((tag) => tag.name.startsWith(`${prefix}-`))
      .map((tag) => ({
        ...tag,
        name: cleanTagName(tag.name),
      })) || [];

  for (const path in document.paths) {
    const methods = document.paths[path];
    const matchedOps: typeof methods = {};

    for (const method in methods) {
      const op = methods[method];
      if (op.tags?.some((t: string) => t.startsWith(`${prefix}-`))) {
        matchedOps[method] = {
          ...op,
          tags: op.tags
            .filter((t: string) => t.startsWith(`${prefix}-`))
            .map(cleanTagName),
        };
      }
    }

    if (Object.keys(matchedOps).length > 0) {
      filtered.paths[path] = matchedOps;
    }
  }

  return filtered;
}

export function setupSwagger(
  app: INestApplication,
  configService: ConfigService,
): void {
  if (configService.get<string>('NODE_ENV') !== 'development') return;

  const swaggerOptions: Record<string, any> = {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none',
      filter: true,
    },
    // customJs: '/swagger-assets/custom.js',
  };
  const backendUrl: string =
    configService.get<string>('BACKEND_URL') || 'http://localhost:3000';

  const servers = [
    {
      url: backendUrl,
      description: 'Development Server',
    },
    {
      url: 'http://localhost:3000',
      description: 'Local Server',
    },
  ];

  // 🟦 Admin Swagger
  const adminConfig = new DocumentBuilder()
    .setTitle('Admin API')
    .setDescription('Admin-only routes')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter Admin JWT token',
      },
      'AdminToken',
    )
    .addServer(servers[0].url)
    .addServer(servers[1].url)
    .build();

  const adminDocFull = SwaggerModule.createDocument(app, adminConfig);
  const adminDocFiltered = filterDocumentByTagPrefix(adminDocFull, 'admin');
  SwaggerModule.setup('docs/admin', app, () => adminDocFiltered, {
    ...swaggerOptions,
    customSiteTitle: 'Admin API Docs',
  })

  // 🟩 Customer Swagger
  const customerConfig = new DocumentBuilder()
    .setTitle('Customer API')
    .setDescription('Customer-only routes')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter Customer JWT token',
      },
      'CustomerToken',
    )
    .addServer(servers[0].url)
    .addServer(servers[1].url)
    .build();

  const customerDocFull = SwaggerModule.createDocument(app, customerConfig);
  const customerDocFiltered = filterDocumentByTagPrefix(
    customerDocFull,
    'customer',
  );
  SwaggerModule.setup('docs/customer', app, () => customerDocFiltered, {
    ...swaggerOptions,
    customSiteTitle: 'Customer API Docs',
  });

  // 🟨 Store Swagger
  const storeConfig = new DocumentBuilder()
    .setTitle('Store API')
    .setDescription('Store-only routes')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter Store JWT token',
      },
      'StoreToken',
    )
    .addServer(servers[0].url)
    .addServer(servers[1].url)
    .build();

  const storeDocFull = SwaggerModule.createDocument(app, storeConfig);
  const storeDocFiltered = filterDocumentByTagPrefix(storeDocFull, 'store');
  SwaggerModule.setup('docs/store', app, () => storeDocFiltered, {
    ...swaggerOptions,
    customSiteTitle: 'Store API Docs',
  });
}
