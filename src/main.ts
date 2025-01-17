import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:8080',
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
