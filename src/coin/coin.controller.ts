import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { CoinService } from "./coin.service";
import { Coin } from "./schemas/coin.schema";
import { CreateCoinDto } from "./dto/create-coin.dto";
import { UpdateCoinDto } from "./dto/update-coin.dto";
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('coins')
export class CoinController {
    constructor(private coinService: CoinService) {}

    @Get()
    async getAllCoins(@Query() query: ExpressQuery): Promise<Coin[]> {
        return this.coinService.findAll(query);
    }

    @Post()
    async createCoin(
        @Body()
        coin: CreateCoinDto,
    ): Promise<Coin> {
        return this.coinService.create(coin);
    }

    @Get(':id')
    async getCoin(
        @Param('id')
        id:string,
    ): Promise<Coin> {
        return this.coinService.findById(id);
    }

    @Put(':id')
    async updateCoin(
        @Param('id')
        id:string,
        @Body()
        coin: UpdateCoinDto,
    ): Promise<Coin> {
        return this.coinService.updateById(id, coin);
    }

    @Delete(':id')
    async deleteCoin(
        @Param('id')
        id:string,
    ): Promise<Coin> {
        return this.coinService.deleteById(id);
    }
}