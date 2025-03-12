import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '../config/config.service';

import { QuoteDao } from './dao/quote.dao';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { QuotesFacade } from './quotes.facade';
import { Quote } from './schemas/quote.schema';
import { PriceProviderFactory } from './services/price-provider.factory';

describe('QuotesFacade', () => {
  let quotesFacade: QuotesFacade;
  let quoteDao: QuoteDao;
  let priceProviderFactory: PriceProviderFactory;
  let configService: ConfigService;

  const mockQuoteDao = {
    create: jest.fn(),
    findById: jest.fn(),
  };

  const mockPriceProvider = {
    getExchangeRate: jest.fn(),
  };

  const mockPriceProviderFactory = {
    getProvider: jest.fn().mockReturnValue(mockPriceProvider),
  };

  const mockConfigService = {
    quoteExpirationTime: 5, // 5 minutes
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuotesFacade,
        {
          provide: QuoteDao,
          useValue: mockQuoteDao,
        },
        {
          provide: PriceProviderFactory,
          useValue: mockPriceProviderFactory,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    quotesFacade = module.get<QuotesFacade>(QuotesFacade);
    quoteDao = module.get<QuoteDao>(QuoteDao);
    priceProviderFactory =
      module.get<PriceProviderFactory>(PriceProviderFactory);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createQuote', () => {
    it('should create a new quote', async () => {
      const createQuoteDto: CreateQuoteDto = {
        amount: 1000000,
        from: 'ARS',
        to: 'ETH',
      };

      const mockExchangeRateResult = {
        rate: 0.0000023,
        provider: 'cryptomkt',
        timestamp: new Date(),
      };

      mockPriceProvider.getExchangeRate.mockResolvedValue(
        mockExchangeRateResult,
      );

      const mockQuote = {
        _id: 'abc123',
        from: 'ARS',
        to: 'ETH',
        amount: 1000000,
        rate: 0.0000023,
        convertedAmount: 2.3,
        timestamp: new Date(),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        provider: 'cryptomkt',
      };

      mockQuoteDao.create.mockResolvedValue(mockQuote);

      const result = await quotesFacade.createQuote(createQuoteDto);

      expect(mockPriceProviderFactory.getProvider).toHaveBeenCalled();
      expect(mockPriceProvider.getExchangeRate).toHaveBeenCalledWith(
        'ARS',
        'ETH',
      );
      expect(mockQuoteDao.create).toHaveBeenCalled();
      expect(result).toEqual(mockQuote);
    });

    it('should throw an error if price provider fails', async () => {
      const createQuoteDto: CreateQuoteDto = {
        amount: 1000000,
        from: 'ARS',
        to: 'ETH',
      };

      mockPriceProvider.getExchangeRate.mockRejectedValue(
        new Error('API error'),
      );

      await expect(quotesFacade.createQuote(createQuoteDto)).rejects.toThrow(
        'API error',
      );
    });
  });

  describe('getQuoteById', () => {
    it('should retrieve an existing and valid quote', async () => {
      const quoteId = 'abc123';
      const currentDate = new Date();
      const futureDate = new Date(currentDate.getTime() + 10 * 60 * 1000); // 10 minutes in the future

      const mockQuote = {
        _id: quoteId,
        from: 'ARS',
        to: 'ETH',
        amount: 1000000,
        rate: 0.0000023,
        convertedAmount: 2.3,
        timestamp: currentDate,
        expiresAt: futureDate,
      };

      mockQuoteDao.findById.mockResolvedValue(mockQuote);

      const result = await quotesFacade.getQuoteById(quoteId);

      expect(mockQuoteDao.findById).toHaveBeenCalledWith(quoteId);
      expect(result).toEqual(mockQuote);
    });

    it('should throw NotFoundException for non-existent quote', async () => {
      const quoteId = 'nonexistent';

      mockQuoteDao.findById.mockResolvedValue(null);

      await expect(quotesFacade.getQuoteById(quoteId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException for expired quote', async () => {
      const quoteId = 'expired';
      const currentDate = new Date();
      const pastDate = new Date(currentDate.getTime() - 10 * 60 * 1000); // 10 minutes in the past

      const mockQuote = {
        _id: quoteId,
        from: 'ARS',
        to: 'ETH',
        amount: 1000000,
        rate: 0.0000023,
        convertedAmount: 2.3,
        timestamp: pastDate,
        expiresAt: pastDate, // Already expired
      };

      mockQuoteDao.findById.mockResolvedValue(mockQuote);

      await expect(quotesFacade.getQuoteById(quoteId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
