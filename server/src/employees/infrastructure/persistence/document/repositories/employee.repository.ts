import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee } from 'src/employees/domain/employee';
import { SortEmployeeDto } from 'src/employees/dto/query-employee.dto';
import domainToDocumentCondition from '../../../../../utils/domain-to-document-condition';
import { EntityCondition } from '../../../../../utils/types/entity-condition.type';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { EmployeeRepository } from '../../employee.repository';
import { EmployeeSchemaClass } from '../entities/employee.schema';
import { EmployeeMapper } from '../mappers/employee.mapper';

@Injectable()
export class EmployeesDocumentRepository implements EmployeeRepository {
  constructor(
    @InjectModel(EmployeeSchemaClass.name)
    private readonly empoyeesModel: Model<EmployeeSchemaClass>,
  ) {}

  async create(data: Employee): Promise<Employee> {
    const persistenceModel = EmployeeMapper.toPersistence(data);
    const createdEmployee = new this.empoyeesModel(persistenceModel);
    const empoyeeObject = await createdEmployee.save();
    return EmployeeMapper.toDomain(empoyeeObject);
  }

  async findManyWithPagination({
    sortOptions,
    paginationOptions,
  }: {
    sortOptions?: SortEmployeeDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Employee[]> {
    const where: EntityCondition<Employee> = {};

    const empoyeeObjects = await this.empoyeesModel
      .find(domainToDocumentCondition(where))
      .sort(
        sortOptions?.reduce(
          (accumulator, sort) => ({
            ...accumulator,
            [sort.orderBy === 'id' ? '_id' : sort.orderBy]:
              sort.order.toUpperCase() === 'ASC' ? 1 : -1,
          }),
          {},
        ),
      )
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return empoyeeObjects.map((empoyeeObject) =>
      EmployeeMapper.toDomain(empoyeeObject),
    );
  }

  async findOne(
    fields: EntityCondition<Employee>,
  ): Promise<NullableType<Employee>> {
    const empoyeeObject = await this.empoyeesModel.findOne(
      domainToDocumentCondition(fields),
    );
    return empoyeeObject ? EmployeeMapper.toDomain(empoyeeObject) : null;
  }

  async update(
    id: Employee['id'],
    payload: Partial<Employee>,
  ): Promise<Employee | null> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const empoyee = await this.empoyeesModel.findOne(filter);

    if (!empoyee) {
      return null;
    }

    const empoyeeObject = await this.empoyeesModel.findOneAndUpdate(
      filter,
      EmployeeMapper.toPersistence({
        ...EmployeeMapper.toDomain(empoyee),
        ...clonedPayload,
      }),
    );

    return empoyeeObject ? EmployeeMapper.toDomain(empoyeeObject) : null;
  }

  async softDelete(id: Employee['id']): Promise<void> {
    await this.empoyeesModel.deleteOne({
      _id: id.toString(),
    });
  }
}
