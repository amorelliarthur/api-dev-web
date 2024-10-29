import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoinSchema} from './schemas/coin.schema';
import { CoinService } from './coin.service';
import { CoinController } from './coin.controller';

@Module({
    imports: [MongooseModule.forFeature([{name:'Coin', schema:CoinSchema}])],
    controllers: [CoinController],
    providers: [CoinService]
})
export class CoinModule {}