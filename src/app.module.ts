import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModule } from './message/message.module';
import { PeopleModule } from './people/people.module';
import { SimpleMiddleware } from './common/middlewares/simple.middleware';
import { AnotherMiddleware } from './common/middlewares/another.middleware';
import { APP_FILTER } from '@nestjs/core';
import { MyExceptionFilter } from './common/filters/my-exception.filter';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DB_TYPE: Joi.required(),
        DB_HOST: Joi.required(),
        DB_PORT: Joi.number().default(5432),
        DB_DATABASE: Joi.required(),
        DB_USERNAME: Joi.required(),
        DB_PASSWORD: Joi.required(),
        AUTO_LOAD_ENTITIES: Joi.number().min(0).max(1),
        SYNCHRONIZE: Joi.number().min(0).max(1),
      })
    }),
    TypeOrmModule.forRoot(
      {
        type: process.env.DB_TYPE as "postgres",
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        database: process.env.DB_DATABASE,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        autoLoadEntities: Boolean(process.env.AUTO_LOAD_ENTITIES),
        synchronize: Boolean(process.env.SYNCHRONIZE)
      }
    ),
    MessageModule,
    PeopleModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: MyExceptionFilter
    }
  ],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SimpleMiddleware, AnotherMiddleware).forRoutes({ path: 'message', method: RequestMethod.GET });
  }
}
