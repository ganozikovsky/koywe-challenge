import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { ConfigService } from '../../config/config.service';

@Injectable()
export class PriceProviderService {
  private readonly logger = new Logger(PriceProviderService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getExchangeRate(from: string, to: string): Promise<number> {
    try {
      const baseUrl = this.configService.cryptoApiBaseUrl;
      const url = `${baseUrl}/price/rate?from=${to}&to=${from}`;

      this.logger.log(`Fetching exchange rate from ${url}`);

      const response = await lastValueFrom(this.httpService.get(url));

      if (response.data && response.data.rate) {
        return parseFloat(response.data.rate);
      }

      throw new Error('Invalid response format from price provider');
    } catch (error) {
      this.logger.error(`Failed to fetch exchange rate: ${error.message}`);

      this.logger.warn('Using simulated exchange rate');
      return this.getSimulatedExchangeRate(from, to);
    }
  }

  private getSimulatedExchangeRate(from: string, to: string): number {
    const rates = {
      ARS_ETH: 0.0000023,
      ETH_ARS: 434782.61,
      BTC_USD: 62000.0,
      USD_BTC: 0.000016,
    };

    const key = `${from}_${to}`;
    if (rates[key]) {
      return rates[key];
    }

    if (this.isCrypto(from) && !this.isCrypto(to)) {
      return Math.random() * 100000 + 10000; // Crypto to fiat (high amount)
    } else if (!this.isCrypto(from) && this.isCrypto(to)) {
      return Math.random() * 0.00001 + 0.000001; // Fiat to crypto (small amount)
    } else {
      return Math.random() * 10 + 0.1; // Either crypto to crypto or fiat to fiat
    }
  }

  private isCrypto(currency: string): boolean {
    const cryptos = ['BTC', 'ETH', 'USDC', 'USDT', 'XRP', 'SOL', 'ADA'];
    return cryptos.includes(currency);
  }
}
