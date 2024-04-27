import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeRepository } from '../employee.repository';
import { EmployeeEntity } from './entities/employee.entity';
import { EmployeesRelationalRepository } from './repositories/employee.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeEntity])],
  providers: [
    {
      provide: EmployeeRepository,
      useClass: EmployeesRelationalRepository,
    },
  ],
  exports: [EmployeeRepository],
})
export class RelationalEmployeePersistenceModule {}
