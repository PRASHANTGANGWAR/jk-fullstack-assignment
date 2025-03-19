import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { models } from './models';
import { relations } from 'src/relations/index';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        return {
          dialect: 'mysql',
          host: config.get('dbHost'),
          port: config.get('dbPort'),
          username: config.get('dbUser'),
          password: config.get('dbPassword'),
          database: config.get('dbName'),
          autoLoadModels: true,
          models,
          define: {
            timestamps: true,
            underscored: true,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule implements OnModuleInit {
  onModuleInit() {
    relations(); // relations are applied after models are fully initialized
  }
}
