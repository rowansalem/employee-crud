export enum PositionEnum {
  JUNIOR = 1,
  SENIOR = 2,
  MANAGER = 3,
}

export type Position = {
  id: number | string;
  name?: string;
};