import { INestApplication } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import axios from 'axios'
import { AppModule } from '../../../server/src/app.module'

describe('GET /api', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => ({
            MONGO_URI: 'mongodb://localhost:27017/tac-med-test',
            AUTH0_DOMAIN: 'test.auth0.com',
            AUTH0_AUDIENCE: 'https://test-api'
          })]
        }),
        AppModule
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()
    await app.listen(3000)

    // Configure axios base URL
    axios.defaults.baseURL = 'http://localhost:3000'
  }, 10000) // Increase timeout to 10s

  afterAll(async () => {
    if (app) {
      await app.close()
    }
  })

  it('should return a message', async () => {
    const res = await axios.get('/api')

    expect(res.status).toBe(200)
    expect(res.data).toEqual({ message: 'Hello, API' })
  })
})
