import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import axios from 'axios'
import { Request } from 'express'
import { passportJwtSecret } from 'jwks-rsa'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UsersService } from '../users/users.service'

interface JwtPayload {
  sub: string
  aud: string[]
  iss: string
  exp: number
  iat: number
  scope?: string
  azp?: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name)
  private readonly domain: string

  constructor(
    configService: ConfigService,
    private usersService: UsersService,
  ) {
    let domain = configService.get<string>('AUTH0_DOMAIN')
    let audience = configService.get<string>('AUTH0_AUDIENCE')

    if (!domain || !audience) {
      domain = 'test.auth0.com'
      audience = 'https://test-api'
    }

    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${domain}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience,
      issuer: `https://${domain}/`,
      algorithms: ['RS256'],
      passReqToCallback: true,
    })

    this.domain = domain
    this.logger.log(`JWT Strategy initialized with domain: ${domain}`)
  }

  async validate(request: Request, payload: JwtPayload) {
    this.logger.debug(`Validating JWT payload: ${JSON.stringify(payload)}`)

    if (!payload) {
      this.logger.error('Invalid token: payload is empty')
      throw new UnauthorizedException('Invalid token')
    }

    try {
      // Get user info from Auth0
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request)
      const userInfo = await axios.get(`https://${this.domain}/userinfo`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const email = userInfo.data.email

      if (!email) {
        this.logger.error('Invalid token: email is missing from userinfo')
        throw new UnauthorizedException('Email is required')
      }

      // Create or sync user in database
      const user = await this.usersService.findOrCreateUser({
        id: payload.sub,
        email: email,
        name: userInfo.data.name || userInfo.data.nickname || email.split('@')[0],
      })

      this.logger.debug(
        `User validated: ${JSON.stringify({ id: user._id, email: user.email, role: user.role })}`,
      )

      return {
        id: payload.sub,
        email: email,
        role: user.role,
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      this.logger.error(`Error validating user: ${errorMessage}`)
      throw new UnauthorizedException('Error validating user')
    }
  }
}
