import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModule } from './message/message.module';
import { PeopleModule } from './people/people.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(
      {
        type: "postgres",
        host: "localhost",
        port: 5432,
        database: "api_nest_message",
        username: "postgres",
        password: "postgres",
        autoLoadEntities: true,
        synchronize: true
      }
    ),
    MessageModule,
    PeopleModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
