import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FilesService } from '../files/files.service';
import { PositionEnum } from '../positions/positions.enum';
import { DeepPartial } from '../utils/types/deep-partial.type';
import { EntityCondition } from '../utils/types/entity-condition.type';
import { NullableType } from '../utils/types/nullable.type';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Employee } from './domain/employee';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { SortEmployeeDto } from './dto/query-employee.dto';
import { EmployeeRepository } from './infrastructure/persistence/employee.repository';
import { PositionDto } from 'd:/suplift/Employee-Task/employee-management-server/src/positions/dto/position.dto';

@Injectable()
export class EmployeesService {
  constructor(
    private readonly employeesRepository: EmployeeRepository,
    private readonly filesService: FilesService,
  ) {}

  async create(createProfileDto: CreateEmployeeDto): Promise<Employee> {
    const clonedPayload = {
      ...createProfileDto,
    };

    await this.validateEmail(clonedPayload.email);

    this.validatePosition(clonedPayload.position);

    return this.employeesRepository.create(clonedPayload);
  }

  private validatePosition(position?: PositionDto | undefined | null) {
    if (position?.id) {
      const positionObject = Object.values(PositionEnum)
        .map(String)
        .includes(String(position.id));
      if (!positionObject) {
        throw new UnprocessableEntityException({
          position: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            position: 'positionNotExists',
          },
        });
      }
    }
  }

  private async validateEmail(email: string | null | undefined) {
    if (email) {
      const employeeObject = await this.employeesRepository.findOne({
        email: email,
      });
      if (employeeObject) {
        throw new UnprocessableEntityException({
          position: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailAlreadyExists',
          },
        });
      }
    }
  }

  findManyWithPagination({
    sortOptions,
    paginationOptions,
  }: {
    sortOptions?: SortEmployeeDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Employee[]> {
    return this.employeesRepository.findManyWithPagination({
      sortOptions,
      paginationOptions,
    });
  }

  findOne(fields: EntityCondition<Employee>): Promise<NullableType<Employee>> {
    return this.employeesRepository.findOne(fields);
  }

  async update(
    id: Employee['id'],
    payload: DeepPartial<Employee>,
  ): Promise<Employee | null> {
    const clonedPayload = { ...payload };

    await this.validateEmail(clonedPayload.email);

    this.validatePosition(clonedPayload.position?.valueOf() as PositionDto);

    if (clonedPayload.position?.id) {
      const positionObject = Object.values(PositionEnum)
        .map(String)
        .includes(String(clonedPayload.position.id));
      if (!positionObject) {
        throw new UnprocessableEntityException({
          position: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            position: 'positionNotExists',
          },
        });
      }
    }

    return this.employeesRepository.update(id, clonedPayload);
  }

  async softDelete(id: Employee['id']): Promise<void> {
    await this.employeesRepository.softDelete(id);
  }
}
