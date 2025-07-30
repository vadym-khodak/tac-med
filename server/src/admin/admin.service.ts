import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class AdminService {
  private readonly passwordFile = path.join(process.cwd(), 'admin-password.txt')
  private readonly defaultPassword = '12345'

  async validatePassword(password: string): Promise<boolean> {
    const storedPassword = await this.getStoredPassword()
    return password === storedPassword
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<{ success: boolean }> {
    if (!(await this.validatePassword(oldPassword))) {
      throw new UnauthorizedException('Invalid old password')
    }

    if (!newPassword || newPassword.length < 3) {
      throw new BadRequestException('New password must be at least 3 characters long')
    }

    await this.storePassword(newPassword)
    return { success: true }
  }

  private async getStoredPassword(): Promise<string> {
    try {
      const password = await fs.readFile(this.passwordFile, 'utf8')
      return password.trim()
    } catch (error) {
      // If file doesn't exist, return default password
      if (error.code === 'ENOENT') {
        await this.storePassword(this.defaultPassword)
        return this.defaultPassword
      }
      throw error
    }
  }

  private async storePassword(password: string): Promise<void> {
    await fs.writeFile(this.passwordFile, password, 'utf8')
  }

  async generateAdminToken(password: string): Promise<{ token: string }> {
    if (!(await this.validatePassword(password))) {
      throw new UnauthorizedException('Invalid password')
    }

    // Generate a simple token (in production, use JWT or similar)
    const token = Buffer.from(`admin:${Date.now()}`).toString('base64')
    return { token }
  }

  validateAdminToken(token: string): boolean {
    try {
      const decoded = Buffer.from(token, 'base64').toString()
      const [prefix, timestamp] = decoded.split(':')

      if (prefix !== 'admin') {
        return false
      }

      // Token valid for 1 hour
      const tokenTime = Number.parseInt(timestamp)
      const currentTime = Date.now()
      const oneHour = 60 * 60 * 1000

      return currentTime - tokenTime < oneHour
    } catch {
      return false
    }
  }
}
