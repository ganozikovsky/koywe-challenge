import { ExchangeRateResult } from '../../interfaces/exchange-rate-result.interface';

/**
 * Price provider strategy interface
 *
 * @export
 * @interface PriceProviderStrategy
 */
export interface PriceProviderStrategy {
  getExchangeRate(from: string, to: string): Promise<ExchangeRateResult>;
}
