import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';
import { Position } from '../domain/position';

export class PositionDto implements Position {
  @ApiProperty({
    example: 1,
    type: Number,
    required: true,
  })
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 0,
    },
    { message: 'Position ID must be a number' },
  )
  @Min(1, { message: 'Position ID must be greater than 0' })
  id: number;
}
