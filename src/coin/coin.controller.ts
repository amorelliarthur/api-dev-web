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

    @Get(':id') // pesquisa por id da moeda
    async getCoin(
        @Param('id')
        id:string,
    ): Promise<Coin> {
        return this.coinService.findById(id);
    }

    // Nova rota para buscar moedas pelo ID do usuário http://localhost:3000/coins/user/672277729b6127616b55252a
    @Get('user/:user')
    async getAllCoinsByUser(
        @Param('user') user: string
    ): Promise<Coin[]> {
        return this.coinService.findAllByUser(user);
    }

    //pesquisa por email http://localhost:3000/coins/user/email/arthur@teste.br
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

    // @Delete(':id')
    // async deleteCoin(
    //     @Param('id')
    //     id:string,
    // ): Promise<Coin> {
    //     return this.coinService.deleteById(id);
    // }
    
    // @Delete(':id')
    // @UseGuards(AuthGuard())
    // async deleteCoin(
    //     @Param('id') id: string,
    //     @Req() req
    // ): Promise<Coin> {
    //     return this.coinService.deleteById(id, req.user);
    // }

    @Delete(':userId/:code')
    @UseGuards(AuthGuard())
    async deleteCoin(
        @Param('userId') userId: string,
        @Param('code') code: string,
        @Req() req
    ): Promise<Coin> {
        // Verifica se o ID do usuário logado corresponde ao ID passado
        if (req.user._id.toString() !== userId) {
            throw new UnauthorizedException('Você não tem permissão para deletar esta moeda.');
        }
        return this.coinService.deleteByCodeAndUser(code, userId);
    }
}