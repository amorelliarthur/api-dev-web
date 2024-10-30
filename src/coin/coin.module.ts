import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoinSchema} from './schemas/coin.schema';
import { CoinService } from './coin.service';
import { CoinController } from './coin.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        AuthModule,
        MongooseModule.forFeature([{name:'Coin', schema:CoinSchema}])
    ],
    controllers: [CoinController],
    providers: [CoinService]
})
export class CoinModule {}