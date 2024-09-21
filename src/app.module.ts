import { Module } from '@nestjs/common';
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

@Module({
  imports: [
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
    UserModule, AuthModule
  ],
  controllers: [],
  providers: [    {
    provide: APP_GUARD,
    useClass: AuthGuard
    ,
  },],
})

export class AppModule {}
