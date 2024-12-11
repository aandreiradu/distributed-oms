import { BadRequestException, Logger } from '@nestjs/common';
import { Currency, DiscountUnit } from '@prisma/client';

type SellPriceArgs = {
  basePrice: number;
  category: string;
  currency: Currency;
  discount?: number;
  discountUnit?: DiscountUnit;
};

class PricingWithDiscountFactory {
  static calculateSellPriceByDiscountUnit(
    basePrice: number,
    discountUnit: string,
    discount: number,
  ): number {
    switch (discountUnit) {
      case DiscountUnit.PERCENTAGE: {
        if (discount > 100) discount = 100;
        return basePrice - (basePrice / 100) * discount;
      }

      case DiscountUnit.UNIT: {
        return basePrice - discount;
      }

      default:
        throw new BadRequestException({
          isSuccess: false,
          error: 'VALIDATION_FAILED',
          message: 'Invalid discountUnit',
        });
    }
  }
}

export default class Pricing {
  private static readonly logger: Logger = new Logger(Pricing.name);
  private static readonly allowedCurrencies = ['RON', 'EUR', 'USD'];
  private static maxProfitPercentage: number = 15;

  private static validateCurrency(currency: string): boolean {
    return Pricing.allowedCurrencies.includes(currency.toUpperCase());
  }

  private static getSellPrice(basePrice: number): number {
    const profit = Math.floor(Math.random() * Pricing.maxProfitPercentage) + 1;
    return basePrice + (profit / 100) * basePrice;
  }

  static calculateSellPrice(args: SellPriceArgs): number {
    try {
      const allowedCurrency = this.validateCurrency(args.currency);

      if (!allowedCurrency) {
        throw new BadRequestException({
          isSuccess: false,
          error: 'VALIDATION_FAILED',
          message: 'Invalid currency',
        });
      }

      let sellingPrice = this.getSellPrice(args.basePrice);

      if (!args.discount || !args.discountUnit) {
        this.logger.log(`Calculate the price without discount`);
        return sellingPrice;
      }

      this.logger.log(`Calculate the price with discount`);
      sellingPrice =
        PricingWithDiscountFactory.calculateSellPriceByDiscountUnit(
          args.basePrice,
          args.discountUnit,
          args.discount,
        );

      return sellingPrice;
    } catch (error) {
      this.logger.warn(`Failed to calculate selling price ${args}`);

      throw error;
    }
  }
}
