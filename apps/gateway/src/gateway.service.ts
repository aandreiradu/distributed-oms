import { SQSService } from '@app/common/aws/sqs.service';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GatewayService {
  private readonly logger: Logger = new Logger(GatewayService.name);
  constructor(
    private readonly sqsService: SQSService,
    private readonly configService: ConfigService,
  ) {}

  async forwardToOrders(orderData: any, correlationId: string) {
    try {
      await this.sqsService.publishMessage({
        QueueUrl: this.configService.getOrThrow<string>(
          'AWS_SQS_ORDERS_QUEUE_URL',
        ),
        MessageBody: JSON.stringify({
          order: {
            ...orderData,
            status: 'PENDING_VALIDATION',
          },
        }),
        MessageAttributes: {
          'X-DOMS-CorrelationId': {
            DataType: 'String',
            StringValue: correlationId,
          },
        },
      });
    } catch (error) {
      this.logger.error('Failed  to publish message to orders queue');
      this.logger.error(error);

      throw new InternalServerErrorException({
        isSuccess: false,
        error: 'INTERNAL_SERVER_EXCEPTION',
        message: 'Order not placed',
      });
    }
  }
}
