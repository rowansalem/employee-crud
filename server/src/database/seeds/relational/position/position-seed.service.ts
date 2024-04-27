import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PositionEntity } from 'src/Positions/infrastructure/persistence/relational/entities/position.entity';
import { Repository } from 'typeorm';
import { PositionEnum } from '../../../../positions/positions.enum';

@Injectable()
export class PositionSeedService {
  constructor(
    @InjectRepository(PositionEntity)
    private repository: Repository<PositionEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (!count) {
      await this.repository.save([
        this.repository.create({
          id: PositionEnum.Junior,
          name: 'Junior',
        }),
        this.repository.create({
          id: PositionEnum.Senior,
          name: 'Senior',
        }),
        this.repository.create({
          id: PositionEnum.Manger,
          name: 'Manger',
        }),
      ]);
    }
  }
}
