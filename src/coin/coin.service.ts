import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Coin } from './schemas/coin.schema';

import { Query } from 'express-serve-static-core';
import { User } from "../auth/schemas/user.schema";


@Injectable()
export class CoinService {
    constructor(
        @InjectModel(Coin.name)
        private coinModel: mongoose.Model<Coin>,
    ){}

    async findAll(query: Query): Promise<Coin[]> {

        // const resPerPage = 2
        // const currentPage = Number(query.page) || 1
        // const skip = resPerPage * (currentPage - 1)

        //console.log(query)
        const keyword = query.keyword
         ? {
                code: {
                    $regex: query.keyword,
                    $options: 'i',
                }, 
            }
         : {};

        const coins = await this.coinModel
            .find({...keyword})
            // .limit(resPerPage)
            // .skip(skip)
        return coins;
    }

    async create(coin: Coin, user: User): Promise<Coin>{
        const data = Object.assign(coin, {user: user._id})
        const res = await this.coinModel.create(data);
        return res;
    }

    // buscar moedas por id da moeda
    async findById(id: string): Promise<Coin>{
        const isValidId = mongoose.isValidObjectId(id)
        if(!isValidId) {
            throw new BadRequestException('Id inválido.')
        }

        const coin = await this.coinModel.findById(id);
        if(!coin) {
            throw new NotFoundException('Moeda não encontrada.')
        }
        return coin;
    }

    // buscar moedas por código do user
    async findAllByUser(user: string): Promise<Coin[]> {
        const coins = await this.coinModel.find({ user: user });
        return coins;
    }

    // buscar moedas pelo email do user
    async findAllByUserEmail(email: string): Promise<Coin[]> {
        const coins = await this.coinModel
            .find()
            .populate({
                path: 'user',  
                match: { email: email },
            });

        return coins.filter(coin => coin.user !== null); // Filtra moedas com campo `user` preenchido
    }

    async updateById(id: string, coin: Coin): Promise<Coin>{
        return await this.coinModel.findByIdAndUpdate(id, coin, {
            new: true,
            runValidators: true,
        });
    }

    async deleteByCodeAndUser(code: string, userId: string): Promise<Coin> {
        // Procura a moeda pelo nome e pelo usuário associado
        const coin = await this.coinModel.findOne({ code: code, user: userId });
    
        if (!coin) {
            throw new NotFoundException('Moeda não encontrada.');
        }
    
        return await this.coinModel.findByIdAndDelete(coin._id);
    }
}
