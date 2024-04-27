import { Allow } from 'class-validator';

export class Position {
  @Allow()
  id: number | string;

  @Allow()
  name?: string;
}
