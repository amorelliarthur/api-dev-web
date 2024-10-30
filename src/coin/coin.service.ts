import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
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

    // coin.service.ts

// Nova função para buscar moedas por codigo user
async findAllByUser(user: string, query: Query): Promise<Coin[]> {
    
    const keyword = query.keyword
        ? {
            code: {
                $regex: query.keyword,
                $options: 'i',
            },
        }
        : {};

    const coins = await this.coinModel
        .find({ user: user, ...keyword }) // Filtra pelo userId e pelo keyword, se houver
                
    return coins;
}

// No coin.service.ts
async findAllByUserEmail(email: string, query: Query): Promise<Coin[]> {
    const keyword = query.keyword
        ? {
            code: {
                $regex: query.keyword,
                $options: 'i',
            },
        }
        : {};

    const coins = await this.coinModel
        .find({ ...keyword })
        .populate({
            path: 'user', // Popula o documento do usuário
            match: { email: email }, // Filtra apenas os usuários com o email especificado
        });

    // Filtra apenas os documentos onde `user` não é `null` após a filtragem por email
    return coins.filter(coin => coin.user !== null);
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
