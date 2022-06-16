import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          uri: 'mongodb+srv://admin:admin123@test.jil9b.mongodb.net/test?retryWrites=true&w=majority',
          useCreateIndex: true,
          useNewUrlParser: true,
          useFindAndModify: false,
        };
      },
    }),
  ],
})
export class MongoRootProviderModule {}
