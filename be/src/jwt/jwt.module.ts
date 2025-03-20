import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule as JwtRootModule, JwtSecretRequestType } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    JwtRootModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        return {
          /**
           * Provides the JWT secret key based on the request type.
           * - SIGN: Uses the private key to sign the token.
           * - VERIFY: Uses the public key to verify the token.
           */
          secretOrKeyProvider(type: JwtSecretRequestType) {
            switch (type) {
              case JwtSecretRequestType.SIGN:
                return config.get<string>('jwtPrivateKey'), 'utf8';

              case JwtSecretRequestType.VERIFY:
                return config.get<string>('jwtPublicKey'), 'utf8';

              default:
                throw new Error('Invalid JwtSecretRequestType');
            }
          },
          signOptions: {
            expiresIn: config.get<string>('jwtExpiry'),
            issuer: config.get<string>('jwtIssuer'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [JwtRootModule],
})
export class JwtModule { }
