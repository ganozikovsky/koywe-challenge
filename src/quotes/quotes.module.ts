import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigModule } from '../config/config.module';

import { QuoteDao } from './dao/quote.dao';
import { QuotesController } from './quotes.controller';
import { QuotesFacade } from './quotes.facade';
import { Quote, QuoteSchema } from './schemas/quote.schema';
import { PriceProviderFactory } from './services';
import { CryptoMktProviderStrategy } from './services/price-strategy/cryptomkt-provider.strategy';
import { SimulatedProviderStrategy } from './services/price-strategy/simulated-provider.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Quote.name, schema: QuoteSchema }]),
    HttpModule,
    ConfigModule,
  ],
  controllers: [QuotesController],
  providers: [
    QuotesFacade,
    QuoteDao,
    PriceProviderFactory,
    CryptoMktProviderStrategy,
    SimulatedProviderStrategy,
  ],
  exports: [QuotesFacade],
})
export class QuotesModule {}
