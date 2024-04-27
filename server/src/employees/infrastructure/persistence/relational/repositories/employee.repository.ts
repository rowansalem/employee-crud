import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, Repository } from 'typeorm';
import { EntityCondition } from '../../../../../utils/types/entity-condition.type';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { Employee } from '../../../../domain/employee';
import { SortEmployeeDto } from '../../../../dto/query-employee.dto';
import { EmployeeRepository } from '../../employee.repository';
import { EmployeeEntity } from '../entities/employee.entity';
import { EmployeeMapper } from '../mappers/employee.mapper';

@Injectable()
export class EmployeesRelationalRepository implements EmployeeRepository {
  constructor(
    @InjectRepository(EmployeeEntity)
    private readonly employeesRepository: Repository<EmployeeEntity>,
  ) {}

  async create(data: Employee): Promise<Employee> {
    const persistenceModel = EmployeeMapper.toPersistence(data);
    const newEntity = await this.employeesRepository.save(
      this.employeesRepository.create(persistenceModel),
    );
    return EmployeeMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    sortOptions,
    paginationOptions,
  }: {
    sortOptions?: SortEmployeeDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Employee[]> {
    const entities = await this.employeesRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });

    return entities.map((employee) => EmployeeMapper.toDomain(employee));
  }

  async findOne(
    fields: EntityCondition<Employee>,
  ): Promise<NullableType<Employee>> {
    const entity = await this.employeesRepository.findOne({
      where: fields as FindOptionsWhere<EmployeeEntity>,
    });

    return entity ? EmployeeMapper.toDomain(entity) : null;
  }

  async update(
    id: Employee['id'],
    payload: Partial<Employee>,
  ): Promise<Employee> {
    const entity = await this.employeesRepository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      throw new Error('Employee not found');
    }

    const updatedEntity = await this.employeesRepository.save(
      this.employeesRepository.create(
        EmployeeMapper.toPersistence({
          ...EmployeeMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return EmployeeMapper.toDomain(updatedEntity);
  }

  async softDelete(id: Employee['id']): Promise<void> {
    await this.employeesRepository.softDelete(id);
  }
}
