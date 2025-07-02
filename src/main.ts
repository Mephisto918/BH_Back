import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import ip from 'ip';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

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
  SwaggerModule.setup('docs', app, document, options);

  app.enableCors();

  const port = 3000;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const localIp: string = ip.address(); // uselless kay maka listen ra diay ka sa tanan port using 0.0.0.0
  console.log(`🚀 Server running at http://${localIp}:${port}`);

  await app.listen(port, '0.0.0.0');
  // await app.listen(port, localIp);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
