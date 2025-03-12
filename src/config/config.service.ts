import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  get nodeEnv(): string {
    return this.configService.get<string>('nodeEnv');
  }

  get port(): number {
    return this.configService.get<number>('port');
  }

  get mongoUri(): string {
    return this.configService.get<string>('database.uri');
  }

  get jwtSecret(): string {
    return this.configService.get<string>('jwt.secret');
  }

  get jwtExpiresIn(): string {
    return this.configService.get<string>('jwt.expiresIn');
  }

  get quoteExpirationTime(): number {
    return this.configService.get<number>('quote.expirationTime');
  }

  get cryptoApiBaseUrl(): string {
    return this.configService.get<string>('api.crypto.baseUrl');
  }

  get useSimulatedProvider(): boolean {
    return this.configService.get<boolean>('api.useSimulated');
  }
}
