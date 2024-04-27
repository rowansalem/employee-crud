import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

import { Employee } from 'src/employees/domain/employee';
import { PositionEntity } from '../../../../../positions/infrastructure/persistence/relational/entities/position.entity';

@Entity({
  name: 'employee',
})
export class EmployeeEntity extends EntityRelationalHelper implements Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String, unique: true, nullable: true })
  email: string | null;

  @Column({ type: String, nullable: true })
  firstName: string | null;

  @Column({ type: String, nullable: true })
  lastName: string | null;

  @Column({ type: Number, nullable: true })
  salary: number | null;

  @ManyToOne(() => PositionEntity, {
    eager: true,
  })
  @JoinColumn({ name: 'position_id', referencedColumnName: 'id' })
  position?: PositionEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
