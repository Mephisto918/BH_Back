import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import ip from 'ip';
import { join } from 'path';
import * as express from 'express'; // <-- Add this
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  if (process.env.NODE_ENV !== 'production') {
    // Serve static files directly from /public folder in project root during dev
    app.use('/', express.static(join(process.cwd(), 'public')));
    console.log('Serving static files from:', join(process.cwd(), 'public'));
  } else {
    // In production, serve from dist/public (after build)
    app.use('/', express.static(join(__dirname, '..', 'public')));
    console.log('Serving static files from:', join(__dirname, '..', 'public'));
  }

  app.use(
    '/media/public',
    express.static(
      join(process.cwd(), configService.mediaPaths.public || 'media/public'),
    ),
  );

  const swagConfig = new DocumentBuilder()
    .setTitle('API')
    .setDescription('BH Api')
    .setVersion('1.0')
    // .addTag('api')
    .build();

  const document = SwaggerModule.createDocument(app, swagConfig);
  const theme = new SwaggerTheme();
  const options = {
    explorer: true,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
  };

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  SwaggerModule.setup('docs', app, document, options);

  app.enableCors();

  const port = 3000;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const localIp: string = ip.address(); // uselless kay maka listen ra diay ka sa tanan port using 0.0.0.0
  console.log(`🚀 Server running at http://${localIp}:${port}`);

  await app.listen(port, '0.0.0.0');
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
