import { Test, TestingModule } from "@nestjs/testing"
import { CoinService } from "./coin.service"
import { getModelToken } from "@nestjs/mongoose"
import { Coin } from "./schemas/coin.schema"
import mongoose, { Model } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CoinService', () => {

    let coinService: CoinService
    let model: Model<Coin>;

    const mockCoin = {
        _id: '6722ea56adfb5ca2993f7045',
        code: 'BTC',
        name: 'BTC/Real Brasileiro',
        user: '672277729b6127616b55252a',
    };    

    const mockCoinService = {
        findById: jest.fn(),
        find: jest.fn(),
        findByIdAndUpdate: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CoinService,
                {
                    provide: getModelToken(Coin.name),
                    useValue: mockCoinService,
                },
            ],
        }).compile()

        coinService = module.get<CoinService>(CoinService)
        model = module.get<Model<Coin>>(getModelToken(Coin.name))

    });

    describe('findAll', () => {
        it('deve retornar todas moedas', async () => {
            //const query = { page: '1', keyword: 'test' };
            const query = { keyword: 'BTC' };


            //   jest.spyOn(model, 'find').mockImplementation(
            //     () =>
            //       ({
            //         limit: () => ({
            //           skip: jest.fn().mockResolvedValue([mockCoin]),
            //         }),
            //       } as any),
            //   );

            jest.spyOn(model, 'find').mockResolvedValue([mockCoin]);


            const result = await coinService.findAll(query);

            expect(model.find).toHaveBeenCalledWith({
                code: { $regex: 'BTC', $options: 'i' },
            });

            expect(result).toEqual([mockCoin]);
        });
    });

    describe('findById', () => {
        it('deve encontrar e retornar uma moeda pelo ID', async () => {
            jest.spyOn(model, 'findById').mockResolvedValue(mockCoin);

            const result = await coinService.findById(mockCoin._id);

            expect(model.findById).toHaveBeenCalledWith(mockCoin._id);
            expect(result).toEqual(mockCoin);
        });

        it('deve retornar BadRequestException se ID inválido for fornecido', async () => {
            const id = 'invalid-id';

            const isValidObjectIDMock = jest
                .spyOn(mongoose, 'isValidObjectId')
                .mockReturnValue(false);

            await expect(coinService.findById(id)).rejects.toThrow(
                BadRequestException,
            );

            expect(isValidObjectIDMock).toHaveBeenCalledWith(id);
            isValidObjectIDMock.mockRestore();
        });

        it('deve retornar NotFoundException se a moeda não for encontrada', async () => {
            jest.spyOn(model, 'findById').mockResolvedValue(null);

            await expect(coinService.findById(mockCoin._id)).rejects.toThrow(
                NotFoundException,
            );

            expect(model.findById).toHaveBeenCalledWith(mockCoin._id);
        });
    });

    describe('updateById', () => {
        it('deve atualizar e devolver uma moeda', async () => {
          const updatedBook = { ...mockCoin, code: 'Updated name' };
          const book = { code: 'Updated name' };
    
          jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updatedBook);
    
          const result = await coinService.updateById(mockCoin._id, book as any);
    
          expect(model.findByIdAndUpdate).toHaveBeenCalledWith(mockCoin._id, book, {
            new: true,
            runValidators: true,
          });
    
          expect(result.code).toEqual(book.code);
        });
      });
    
});