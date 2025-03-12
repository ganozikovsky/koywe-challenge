import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { ConfigService } from '../config/config.service';

import { QuoteDao } from './dao/quote.dao';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { Quote } from './schemas/quote.schema';
import { PriceProviderFactory } from './services/price-provider.factory';

@Injectable()
export class QuotesFacade {
  private readonly logger = new Logger(QuotesFacade.name);

  constructor(
    private readonly quoteDao: QuoteDao,
    private readonly priceProviderFactory: PriceProviderFactory,
    private readonly configService: ConfigService,
  ) {}

  async createQuote(createQuoteDto: CreateQuoteDto): Promise<Quote> {
    const { from, to, amount } = createQuoteDto;

    const priceProvider = this.priceProviderFactory.getProvider();

    try {
      const exchangeRateResult = await priceProvider.getExchangeRate(from, to);
      const convertedAmount = amount * exchangeRateResult.rate;
      const timestamp = new Date();

      const expiresAt = new Date(
        timestamp.getTime() +
          this.configService.quoteExpirationTime * 60 * 1000,
      );

      const quoteData = {
        from,
        to,
        amount,
        rate: exchangeRateResult.rate,
        convertedAmount,
        timestamp,
        expiresAt,
        provider: exchangeRateResult.provider,
      };

      return this.quoteDao.create(quoteData);
    } catch (error) {
      this.logger.error(`Failed to create quote: ${error.message}`);
      throw error;
    }
  }

  async getQuoteById(id: string): Promise<Quote> {
    const quote = await this.quoteDao.findById(id);

    if (!quote) {
      this.logger.warn(`Quote with id ${id} not found`);
      throw new NotFoundException('Quote not found');
    }

    if (new Date() > quote.expiresAt) {
      this.logger.warn(`Quote with id ${id} has expired`);
      throw new NotFoundException('Quote has expired');
    }

    return quote;
  }
}
