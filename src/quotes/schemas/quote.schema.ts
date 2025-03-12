import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Quote extends Document {
  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  to: string;

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({ required: true, type: Number })
  rate: number;

  @Prop({ required: true, type: Number })
  convertedAmount: number;

  @Prop({ required: true, type: Date })
  timestamp: Date;

  @Prop({ required: true, type: Date })
  expiresAt: Date;

  @Prop({ type: String })
  provider: string;
}

export const QuoteSchema = SchemaFactory.createForClass(Quote);
