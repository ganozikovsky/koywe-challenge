import { Injectable } from '@nestjs/common';

import { ConfigService } from '../../config/config.service';

import {
  CryptoMktProviderStrategy,
  PriceProviderStrategy,
  SimulatedProviderStrategy,
} from './price-strategy';

@Injectable()
export class PriceProviderFactory {
  constructor(
    private readonly cryptoMktProvider: CryptoMktProviderStrategy,
    private readonly simulatedProvider: SimulatedProviderStrategy,
    private readonly configService: ConfigService,
  ) {}

  getProvider(preferredProvider?: string): PriceProviderStrategy {
    if (preferredProvider) {
      switch (preferredProvider) {
        case 'simulation':
          return this.simulatedProvider;
        case 'cryptomkt':
          return this.cryptoMktProvider;
        default:
          throw new Error(`Unknown provider: ${preferredProvider}`);
      }
    }

    if (
      this.configService.nodeEnv === 'test' ||
      this.configService.useSimulatedProvider
    ) {
      return this.simulatedProvider;
    }

    return this.cryptoMktProvider;
  }
}
