import { BadRequestException, Logger } from '@nestjs/common';
import { disconnect } from 'process';

type SellPriceArgs = {
  basePrice: number;
  category: string;
  currency: string;
  discount?: number;
  discountUnit?: string;
};
export class Pricing {
  private readonly logger: Logger = new Logger(Pricing.name);
  private readonly allowedCurrencies = ['RON', 'EUR', 'USD'];
  private static maxProfitPercentage: number = 15;
  constructor() {}

  validateCurrency(currency: string): boolean {
    return this.allowedCurrencies.includes(currency.toUpperCase());
  }

  getSellPrice(basePrice: number): number {
    const profit = Math.floor(Math.random() * Pricing.maxProfitPercentage) + 1;
    return basePrice + (profit / 100) * basePrice;
  }

  calculateSellPrice(args: SellPriceArgs): number {
    try {
      const allowedCurrency = this.validateCurrency(args.currency);

      if (!allowedCurrency) {
        throw new BadRequestException({
          isSuccess: false,
          error: 'VALIDATION_FAILED',
          message: 'Invalid currency',
        });
      }

      if (!args.discount || !args.discountUnit) {
        this.logger.log(`Calculate the price without discount`);
        return this.getSellPrice(args.basePrice);
      }

      this.logger.log(`Calculate the price with discount`);
    } catch (error) {
      this.logger.warn(`Failed to calculate selling price ${args}`);

      return null;
    }
  }
}