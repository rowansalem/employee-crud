import { Expose } from 'class-transformer';
import { Position } from 'src/Positions/domain/position';

export class Employee {
  id: number | string;

  @Expose({ groups: ['me', 'admin'] })
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  salary: number | null;
  position?: Position;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
