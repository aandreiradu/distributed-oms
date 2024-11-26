import {
  SQS,
  SQSClient,
  SendMessageCommand,
  SendMessageCommandInput,
} from '@aws-sdk/client-sqs';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SQSService {
  private readonly logger: Logger = new Logger(SQSService.name);
  private sqsClient = new SQSClient();

  constructor(private readonly configService: ConfigService) {
    if (this.configService.get<string>('NODE_ENV') === 'development') {
      this.sqsClient['endpoint'] = 'http://localhost:4566';
    }
  }

  async publishMessage(command: SendMessageCommandInput) {
    try {
      await this.sqsClient.send(new SendMessageCommand(command));
    } catch (error) {
      this.logger.error(
        `Failed to send message to queue ${
          command.QueueUrl
        }; command was: ${JSON.stringify(command)}`,
      );
      this.logger.error(error);

      throw new InternalServerErrorException({
        isSuccess: false,
        message: `Failed to publish message to queue`,
        error: 'INTERNAL_SERVER_EXCEPTION',
      });
    }
  }
}
