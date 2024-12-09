import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { LockResource } from './lock';

interface SequencerProps {
  code: string;
  prefix?: string;
  padding?: number;

  rangeMin?: number;
  rangeMax?: number;
}

@Injectable()
export class Sequencer {
  private sequenceCache: Record<string, number> = {};
  constructor(private readonly prismaService: PrismaService) {}

  private async sequencerFactory(code: string): Promise<number> {
    switch (code) {
      case 'ORDERS': {
        const order = await this.prismaService.order.findFirst({
          orderBy: { id: 'desc' },
          select: { id: true },
        });

        return +order?.id || 0;
      }

      default: {
        throw new Error(`Unsupported code: ${code}`);
      }
    }
  }

  // async getSequenceNumber(props: SequencerProps) {
  //   return await LockResource.lock(
  //     `${props.code}-SequencerLock`,
  //     async () => {
  //       if (!this.sequenceCache[props.code]) {
  //         this.sequenceCache[props.code] = await this.sequencerFactory(
  //           props.code,
  //         );
  //       }

  //       const nextSequence = ++this.sequenceCache[props.code];
  //       let formattedNumber = nextSequence.toString();

  //       if (props.padding) {
  //         formattedNumber = formattedNumber.padStart(props.padding, '0');
  //         console.log('padding formattedNumber', formattedNumber);
  //       }

  //       if (props.prefix) {
  //         formattedNumber = `${props.prefix}${formattedNumber}`;
  //       }

  //       return formattedNumber;
  //     },
  //     true,
  //   );
  // }
}
