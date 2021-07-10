import { NODE_PORT } from '@core/environments'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './appModule'
import { SwaggerOptions } from './config/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const document = SwaggerModule.createDocument(app, SwaggerOptions)
  SwaggerModule.setup('docs', app, document)

  await app.listen(NODE_PORT, () => console.log(`listening on port ${NODE_PORT}`))
}

bootstrap()
