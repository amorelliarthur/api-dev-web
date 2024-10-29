import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Coin } from './schemas/coin.schema';

import { Query } from 'express-serve-static-core';


@Injectable()
export class CoinService {
    constructor(
        @InjectModel(Coin.name)
        private coinModel: mongoose.Model<Coin>,
    ){}

    async findAll(query: Query): Promise<Coin[]> {

        const resPerPage = 2
        const currentPage = Number(query.page) || 1
        const skip = resPerPage * (currentPage - 1)

        //console.log(query)
        const keyword = query.keyword
         ? {
                code: {
                    $regex: query.keyword,
                    $options: 'i',
                }, 
            }
         : {};

        const coins = await this.coinModel.find({...keyword}).limit(resPerPage).skip(skip)
        return coins;
    }

    async create(coin: Coin): Promise<Coin>{
        const res = await this.coinModel.create(coin);
        return res;
    }

    async findById(id: string): Promise<Coin>{
        const coin = await this.coinModel.findById(id);

        if(!coin) {
            throw new NotFoundException('Moeda não encontrada.')
        }

        return coin;
    }

    async updateById(id: string, coin: Coin): Promise<Coin>{
        return await this.coinModel.findByIdAndUpdate(id, coin, {
            new: true,
            runValidators: true,
        });
    }

    async deleteById(id: string): Promise<Coin>{
        return await this.coinModel.findByIdAndDelete(id);
    }
}
