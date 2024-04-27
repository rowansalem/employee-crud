import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { EmployeeEntity } from 'src/employees/infrastructure/persistence/relational/entities/employee.entity';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { Position } from '../../../../domain/position';

@Entity({
  name: 'position',
})
export class PositionEntity extends EntityRelationalHelper implements Position {
  @PrimaryColumn()
  id: number;

  @Column({ type: String, nullable: true })
  name: string;

  @OneToMany(() => EmployeeEntity, (employee) => employee.position)
  employees: EmployeeEntity[];
}
