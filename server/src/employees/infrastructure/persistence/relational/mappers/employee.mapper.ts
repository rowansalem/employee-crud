import { PositionEntity } from 'src/Positions/infrastructure/persistence/relational/entities/position.entity';
import { Employee } from '../../../../domain/employee';
import { EmployeeEntity } from '../entities/employee.entity';

export class EmployeeMapper {
  static toDomain(raw: EmployeeEntity): Employee {
    const employee = new Employee();
    employee.id = raw.id;
    employee.email = raw.email;
    employee.firstName = raw.firstName;
    employee.lastName = raw.lastName;
    employee.salary = raw.salary;

    employee.position = raw.position;
    employee.createdAt = raw.createdAt;
    employee.updatedAt = raw.updatedAt;
    employee.deletedAt = raw.deletedAt;
    return employee;
  }

  static toPersistence(employee: Employee): EmployeeEntity {
    let position: PositionEntity | undefined = undefined;

    if (employee.position) {
      position = new PositionEntity();
      position.id = Number(employee.position.id);
    }

    const employeeEntity = new EmployeeEntity();
    if (employee.id && typeof employee.id === 'number') {
      employeeEntity.id = employee.id;
    }
    employeeEntity.email = employee.email;
    employeeEntity.firstName = employee.firstName;
    employeeEntity.lastName = employee.lastName;
    employeeEntity.salary = employee.salary;
    employeeEntity.position = position;
    employeeEntity.createdAt = employee.createdAt;
    employeeEntity.updatedAt = employee.updatedAt;
    employeeEntity.deletedAt = employee.deletedAt;
    return employeeEntity;
  }
}
