import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PositionEntity } from 'src/Positions/infrastructure/persistence/relational/entities/position.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import appConfig from '../../../config/app.config';
import databaseConfig from '../../config/database.config';
import { TypeOrmConfigService } from '../../typeorm-config.service';
import { PositionSeedModule } from './position/position-seed.module';
import { RoleSeedModule } from './role/role-seed.module';
import { StatusSeedModule } from './status/status-seed.module';
import { UserSeedModule } from './user/user-seed.module';

@Module({
  imports: [
    RoleSeedModule,
    PositionSeedModule,
    StatusSeedModule,
    UserSeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options)
          .initialize()
          .then((dataSource) => {
            console.log('Database initialized');
            console.log(dataSource.getMetadata(PositionEntity));
            return dataSource;
          })
          .catch((error) => {
            console.error(
              'Error during Data Source Initializationnnnn:',
              error,
            );
            process.exit(1); // Exit in case of initialization failure to avoid further issues
          });
      },
    }),
  ],
})
export class SeedModule {}
