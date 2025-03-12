import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ApiResponseDecorator } from 'src/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { CreateQuoteDto } from './dto/create-quote.dto';
import { QuotesFacade } from './quotes.facade';
import { Quote } from './schemas/quote.schema';

/**
 * Controller for handling quotes
 *
 * @export
 * @class QuotesController
 */
@Controller('quotes')
@ApiTags('quotes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class QuotesController {
  constructor(private readonly quotesFacade: QuotesFacade) {}

  @Post()
  @ApiOperation({ summary: 'Create a new quote' })
  @ApiResponseDecorator({
    type: Quote,
    description: 'Quote created successfully',
  })
  async createQuote(@Body() createQuoteDto: CreateQuoteDto) {
    return this.quotesFacade.createQuote(createQuoteDto);
  }

  /**
   * Get a quote by ID
   *
   * @param {string} id
   * @return {*}
   * @memberof QuotesController
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a quote by ID' })
  @ApiParam({ name: 'id', description: 'Quote ID' })
  @ApiResponseDecorator({
    type: Quote,
    description: 'Quote retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Quote not found or expired' })
  async getQuote(@Param('id') id: string) {
    return this.quotesFacade.getQuoteById(id);
  }
}
