import { PositionSchema } from 'src/positions/infrastructure/persistence/document/entities/position.schema';
import { Position } from '../../../../../positions/domain/position';
import { Employee } from '../../../../domain/employee';
import { EmployeeSchemaClass } from '../entities/employee.schema';

export class EmployeeMapper {
  static toDomain(raw: EmployeeSchemaClass): Employee {
    const employee = new Employee();
    employee.id = raw._id.toString();
    employee.email = raw.email;
    employee.firstName = raw.firstName;
    employee.lastName = raw.lastName;
    employee.salary = raw.salary;
    if (raw.position) {
      employee.position = new Position();
      employee.position.id = raw.position._id;
    }

    employee.createdAt = raw.createdAt;
    employee.updatedAt = raw.updatedAt;
    employee.deletedAt = raw.deletedAt;
    return employee;
  }

  static toPersistence(employee: Employee): EmployeeSchemaClass {
    let position: PositionSchema | undefined = undefined;

    if (employee.position) {
      position = new PositionSchema();
      position._id = employee.position.id.toString();
    }

    const employeeEntity = new EmployeeSchemaClass();
    if (employee.id && typeof employee.id === 'string') {
      employeeEntity._id = employee.id;
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
