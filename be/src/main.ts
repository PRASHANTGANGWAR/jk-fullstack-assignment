import { join } from 'path';
import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  // Create a NestJS application instance
  const app = await NestFactory.create(AppModule);

  // Get allowed origins for CORS from environment variables or default to '*'
  const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['*'];

  // Enable Cross-Origin Resource Sharing (CORS) to allow requests from different origins
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies and authentication headers
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
  });

  // Use NestJS Pino logger for logging requests and errors
  app.useLogger(app.get(Logger));

  // Register a global error interceptor for better error logging
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  // Swagger API documentation setup
  const config = new DocumentBuilder()
    .setTitle('Blog Application')
    .setDescription('Documentation for API')
    .setVersion('v1')
    .addTag('BLOG') // Categorizes API endpoints under "BLOG"
    .addBearerAuth() // Enables Bearer Token Authentication for protected endpoints
    .build();

  // Generate API documentation and mount it at `/api`
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Serve static files (uploads directory) for handling file uploads
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // Start the server on the specified port from environment variables
  await app.listen(process.env.APP_PORT);
}

// Start the application
bootstrap();
