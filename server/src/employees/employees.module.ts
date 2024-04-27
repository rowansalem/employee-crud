import { Module } from '@nestjs/common';

import { EmployeesController } from './employees.controller';

import { EmployeesService } from './employees.service';
import { DocumentEmployeePersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { RelationalEmployeePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { DatabaseConfig } from '../database/config/database-config.type';
import databaseConfig from '../database/config/database.config';
import { FilesModule } from '../files/files.module';

// <database-block>
const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentEmployeePersistenceModule
  : RelationalEmployeePersistenceModule;
// </database-block>

@Module({
  imports: [infrastructurePersistenceModule, FilesModule],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService, infrastructurePersistenceModule],
})
export class EmployeesModule {}
