import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  
  getRequest(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    // 1. Check for token in cookies
    if (request.cookies?.access_token) {
      // Validate cookie format before setting header
      const cookieToken = request.cookies.access_token;
      if (this.isValidTokenFormat(cookieToken)) {
        request.headers.authorization = `Bearer ${cookieToken}`;
      }
    }

    // 2. Fall back to existing authorization header 
    return request;
  }

  // Enhanced error handling
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      const errorMessage = this.getErrorMessage(err || info);
      throw new UnauthorizedException(`error is ${errorMessage}`);
    }
    return user;
  }

  private isValidTokenFormat(token: string): boolean {
    // Basic JWT format validation (3 parts separated by dots)
    return token.split('.').length === 3;
  }

  private getErrorMessage(error: any): string {
    if (error.name === 'TokenExpiredError') {
      return 'Token expired';
    }
    if (error.name === 'JsonWebTokenError') {
      return 'Invalid token format';
    }
    if (error.message?.includes('Unauthorized')) {
      return 'Invalid credentials';
    }
    return 'Authentication failed';
  }
}