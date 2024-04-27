import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { PositionDto } from '../../positions/dto/position.dto';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class CreateEmployeeDto {
  @ApiProperty({
    example: 'test1@example.com',
    type: String,
    required: true,
    format: 'email',
  })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email' })
  email: string | null;

  @ApiProperty({ example: 'John', type: String, required: true })
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string | null;

  @ApiProperty({ example: 'Doe', type: String, required: true })
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string | null;

  @ApiProperty({ example: 1000, type: Number, required: true })
  @IsNotEmpty({ message: 'Salary is required' })
  salary: number | null;

  @ApiPropertyOptional({ type: PositionDto })
  @IsOptional()
  @Type(() => PositionDto)
  position?: PositionDto;
}
