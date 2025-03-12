import { Injectable, Logger } from '@nestjs/common';

import { ExchangeRateResult } from '../../interfaces/exchange-rate-result.interface';

import { PriceProviderStrategy } from './price-provider.interface';

@Injectable()
export class SimulatedProviderStrategy implements PriceProviderStrategy {
  private readonly logger = new Logger(SimulatedProviderStrategy.name);

  async getExchangeRate(from: string, to: string): Promise<ExchangeRateResult> {
    this.logger.log(`Providing simulated exchange rate for ${from} to ${to}`);

    return {
      rate: this.getSimulatedExchangeRate(from, to),
      provider: 'simulation',
      timestamp: new Date(),
    };
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
