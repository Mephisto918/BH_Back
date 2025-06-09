import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import ip from 'ip';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const port = 3000;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const localIp: string = ip.address();
  console.log(`🚀 Server running at http://${localIp}:${port}`);

  app.setGlobalPrefix('api');
  await app.listen(port, localIp);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
