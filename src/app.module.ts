import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoinModule } from './coin/coin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    CoinModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
 