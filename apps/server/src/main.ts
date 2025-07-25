import serverlessExpress from '@codegenie/serverless-express'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { APIGatewayProxyEvent, Callback, Context, Handler } from 'aws-lambda'
import { config } from 'dotenv'
import { AppModule } from './app.module'
import './instrument'

// Load environment variables
config()

export async function getNestjsApp() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe())

  // Enable CORS
  app.enableCors({
    origin: process.env.ORIGIN_URL,
    credentials: true,
  })
  await app.init()
  return app
}
// For local development
async function bootstrap() {
  const app = await getNestjsApp()

  const port = process.env.PORT || 3000
  await app.listen(port)
  console.log(`Server running on http://localhost:${port}`)
}

// Start the server based on environment
if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  bootstrap()
}

let server: Handler

async function bootstrapServer() {
  const app = await getNestjsApp()
  const expressApp = app.getHttpAdapter().getInstance()
  return serverlessExpress({ app: expressApp })
}

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrapServer())
  return server(event, context, callback)
}
