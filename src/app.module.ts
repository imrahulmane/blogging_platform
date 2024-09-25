import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt-config';
import dbConfig from './config/db-config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guards';
import { BlogsModule } from './blogs/blogs.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { LoggerMiddleware } from './middlewares/logger.middleware';

@Module({
  imports: [
    // WinstonModule.forRoot({
    //   transports: [
    //     new winston.transports.Console({
    //       format: winston.format.combine(
    //         winston.format.timestamp(),
    //         winston.format.simple(),
    //       ),
    //     }),
    //     new winston.transports.File({ filename: 'app.log' }),
    //   ],
    // }),
    
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env', load : [jwtConfig, dbConfig]}),  // Global configuration module
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('db')
    }),
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('jwt'),
      global: true
    }),
    UserModule, AuthModule, BlogsModule
  ],
  controllers: [],
  providers: [    {
    provide: APP_GUARD,
    useClass: AuthGuard
    ,
  },],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware) // Apply the middleware globally
      .forRoutes('*'); // '*' indicates all routes
  }
}
