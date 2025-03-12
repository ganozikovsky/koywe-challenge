import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Quote } from '../schemas/quote.schema';

@Injectable()
export class QuoteDao {
  constructor(@InjectModel(Quote.name) private quoteModel: Model<Quote>) {}

  async create(quoteData: Partial<Quote>): Promise<Quote> {
    const createdQuote = new this.quoteModel(quoteData);
    return createdQuote.save();
  }

  async findById(id: string): Promise<Quote | null> {
    return this.quoteModel.findById(id).exec();
  }

  async findActiveQuotes(
    limit: number = 10,
    skip: number = 0,
  ): Promise<Quote[]> {
    return this.quoteModel
      .find({ expiresAt: { $gt: new Date() } })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async deleteExpiredQuotes(): Promise<any> {
    return this.quoteModel
      .deleteMany({ expiresAt: { $lt: new Date() } })
      .exec();
  }
}
