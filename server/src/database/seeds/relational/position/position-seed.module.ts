import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PositionEntity } from 'src/Positions/infrastructure/persistence/relational/entities/position.entity';
import { PositionSeedService } from './position-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([PositionEntity])],
  providers: [PositionSeedService],
  exports: [PositionSeedService],
})
export class PositionSeedModule {}
