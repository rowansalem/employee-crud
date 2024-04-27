import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { EntityCondition } from '../../../utils/types/entity-condition.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Employee } from '../../domain/employee';

import { SortEmployeeDto } from '../../dto/query-employee.dto';

export abstract class EmployeeRepository {
  abstract create(
    data: Omit<Employee, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Employee>;

  abstract findManyWithPagination({
    sortOptions,
    paginationOptions,
  }: {
    sortOptions?: SortEmployeeDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Employee[]>;

  abstract findOne(
    fields: EntityCondition<Employee>,
  ): Promise<NullableType<Employee>>;

  abstract update(
    id: Employee['id'],
    payload: DeepPartial<Employee>,
  ): Promise<Employee | null>;

  abstract softDelete(id: Employee['id']): Promise<void>;
}
