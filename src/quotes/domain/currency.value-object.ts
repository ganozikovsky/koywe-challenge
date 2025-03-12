export class Currency {
  private readonly value: string;
  private static readonly VALID_FIAT = ['USD', 'EUR', 'ARS', 'CLP', 'MXN'];
  private static readonly VALID_CRYPTO = [
    'BTC',
    'ETH',
    'USDC',
    'USDT',
    'XRP',
    'SOL',
    'ADA',
  ];

  private constructor(value: string) {
    this.value = value.toUpperCase();
  }

  static create(value: string): Currency {
    const upperValue = value.toUpperCase();
    if (!Currency.isValidCurrency(upperValue)) {
      throw new Error(`Invalid currency: ${value}`);
    }
    return new Currency(upperValue);
  }

  static isValidCurrency(currency: string): boolean {
    return [...Currency.VALID_FIAT, ...Currency.VALID_CRYPTO].includes(
      currency.toUpperCase(),
    );
  }

  isCrypto(): boolean {
    return Currency.VALID_CRYPTO.includes(this.value);
  }

  isFiat(): boolean {
    return Currency.VALID_FIAT.includes(this.value);
  }

  equals(currency: Currency): boolean {
    return this.value === currency.value;
  }

  toString(): string {
    return this.value;
  }

  valueOf(): string {
    return this.value;
  }
}
