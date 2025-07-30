import { Controller, Get, InternalServerErrorException } from '@nestjs/common'
import { InjectConnection } from '@nestjs/mongoose'
import { Connection } from 'mongoose'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectConnection() private readonly mongoConnection: Connection,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('health')
  async getHealth(): Promise<{
    status: string
    timestamp: string
    details: Record<string, unknown>
  }> {
    try {
      // Check MongoDB connection
      const isMongoConnected = this.mongoConnection.readyState === 1

      if (!isMongoConnected) {
        throw new InternalServerErrorException('MongoDB is not connected')
      }

      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        details: {
          mongodb: {
            status: 'ok',
            readyState: this.mongoConnection.readyState,
          },
        },
      }
    } catch (error) {
      throw new InternalServerErrorException({
        status: 'error',
        timestamp: new Date().toISOString(),
        details: {
          mongodb: {
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        },
      })
    }
  }
}
