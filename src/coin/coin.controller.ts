import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { CoinService } from "./coin.service";
import { Coin } from "./schemas/coin.schema";
import { CreateCoinDto } from "./dto/create-coin.dto";
import { UpdateCoinDto } from "./dto/update-coin.dto";
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from "@nestjs/passport";

@Controller('coins')
export class CoinController {
    constructor(private coinService: CoinService) {}

    @Get()
    async getAllCoins(@Query() query: ExpressQuery): Promise<Coin[]> {
        return this.coinService.findAll(query);
    }

    @Post()
    @UseGuards(AuthGuard())
    async createCoin(
        @Body()
        coin: CreateCoinDto,
        @Req() req,
    ): Promise<Coin> {
        //console.log(req.user);
        return this.coinService.create(coin, req.user);
    }

    @Get(':id')
    async getCoin(
        @Param('id')
        id:string,
    ): Promise<Coin> {
        return this.coinService.findById(id);
    }

    @Get('user/:user')
    async getAllCoinsByUser(
        @Param('user') user: string
    ): Promise<Coin[]> {
        return this.coinService.findAllByUser(user);
    }

    @Get('user/email/:email')
    async getAllCoinsByUserEmail(
        @Param('email') email: string
    ): Promise<Coin[]> {
        return this.coinService.findAllByUserEmail(email);
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

    @Delete(':userId/:code')
    @UseGuards(AuthGuard())
    async deleteCoin(
        @Param('userId') userId: string,
        @Param('code') code: string,
        @Req() req
    ): Promise<Coin> {
        if (req.user._id.toString() !== userId) {
            throw new UnauthorizedException('Você não tem permissão para deletar esta moeda.');
        }
        return this.coinService.deleteByCodeAndUser(code, userId);
    }
}