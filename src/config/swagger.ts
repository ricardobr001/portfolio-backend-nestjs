import { DocumentBuilder } from '@nestjs/swagger'

export const SwaggerOptions = new DocumentBuilder()
  .setTitle('ricardobr001')
  .setDescription('ricardobr001 API documentation')
  .setVersion('1.0')
  .build()
