// * reason for aliasing because i want the name to be preserved
import { ConfigModule as ConfigurationModule } from '@nestjs/config';
import { Module, Global } from '@nestjs/common';
import { ConfigService } from './config.service';
import { z } from 'zod';

// TODO: needs validators such as Zod or Joi
const configSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.string().transform(Number),
  ENVIRONMENT: z.enum(['DEVELOPMENT', 'PRODUCTION', 'TEST']),
  SECRET_KEY: z.string(),
  JWT_SECRET_KEY: z.string(),
});

@Global()
@Module({
  imports: [
    ConfigurationModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [
        () => {
          const result = configSchema.safeParse(process.env);
          if (!result.success) {
            console.error(result.error.format());
            throw new Error('Invalid Environment Variables');
          }
          return result.data;
        },
      ],
      // load:
      // ignoreEnvFile: boolean
      // ignoreEnvVars: boolean
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
