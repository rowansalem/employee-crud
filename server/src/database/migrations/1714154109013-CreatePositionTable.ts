import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePositionTable1714154109013 implements MigrationInterface {
  name = 'CreatePositionTable1714154109013';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "position" ("id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_b7f483581562b4dc62ae1a5b7e2" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "position"`);
  }
}
