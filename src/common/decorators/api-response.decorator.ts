import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';

interface ApiResponseOptions {
  type: Type<any>;
  description?: string;
}

export const ApiResponseDecorator = (options: ApiResponseOptions) => {
  return applyDecorators(
    ApiExtraModels(options.type),
    ApiOkResponse({
      description: options.description || 'Successful operation',
      schema: {
        properties: {
          data: { $ref: getSchemaPath(options.type) },
          meta: {
            type: 'object',
            properties: {
              timestamp: { type: 'string', format: 'date-time' },
              statusCode: { type: 'number' },
            },
          },
        },
      },
    }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
};
