import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeRepository } from '../employee.repository';
import {
  EmployeeSchema,
  EmployeeSchemaClass,
} from './entities/employee.schema';
import { EmployeesDocumentRepository } from './repositories/employee.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmployeeSchemaClass.name, schema: EmployeeSchema },
    ]),
  ],
  providers: [
    {
      provide: EmployeeRepository,
      useClass: EmployeesDocumentRepository,
    },
  ],
  exports: [EmployeeRepository],
})
export class DocumentEmployeePersistenceModule {}
