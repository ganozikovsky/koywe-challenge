import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { ConfigService } from '../../../config/config.service';
import { ExchangeRateResult } from '../../interfaces/exchange-rate-result.interface';

import { PriceProviderStrategy } from './price-provider.interface';

@Injectable()
export class CryptoMktProviderStrategy implements PriceProviderStrategy {
  private readonly logger = new Logger(CryptoMktProviderStrategy.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getExchangeRate(from: string, to: string): Promise<ExchangeRateResult> {
    try {
      const baseUrl = this.configService.cryptoApiBaseUrl;
      const url = `${baseUrl}/price/rate?from=${to}&to=${from}`;

      this.logger.log(`Fetching exchange rate from CryptoMKT: ${url}`);

      const response = await lastValueFrom(this.httpService.get(url));

      if (response.data && response.data.rate) {
        return {
          rate: parseFloat(response.data.rate),
          provider: 'cryptomkt',
          timestamp: new Date(),
        };
      }

      throw new Error('Invalid response format from CryptoMKT');
    } catch (error) {
      this.logger.error(`CryptoMKT provider error: ${error.message}`);
      throw error;
    }
  }
}
