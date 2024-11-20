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
import { Message } from 'aws-sdk/clients/sqs';

@Injectable()
export class SQSService {
  private readonly logger: Logger = new Logger(SQSService.name);
  private sqsClient = new SQSClient();
  clients: Record<string, SQS> = {};

  async publishMessage(command: SendMessageCommandInput) {
    try {
      return this.sqsClient.send(new SendMessageCommand(command));
    } catch (error) {
      this.logger.error(
        `Failed to send message to queue ${
          command.QueueUrl
        }; command was: ${JSON.stringify(command)}`,
      );
      this.logger.error(error);

      throw new InternalServerErrorException(`Failed to send message to queue`);
    }
  }
}
