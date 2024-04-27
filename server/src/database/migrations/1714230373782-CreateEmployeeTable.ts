import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEmployeeTable1714230373782 implements MigrationInterface {
    name = 'CreateEmployeeTable1714230373782'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "employee" ("id" SERIAL NOT NULL, "email" character varying, "firstName" character varying, "lastName" character varying, "salary" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "position_id" integer, CONSTRAINT "UQ_817d1d427138772d47eca048855" UNIQUE ("email"), CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_6ab3ec557a640017d53ac0e0ab7" FOREIGN KEY ("position_id") REFERENCES "position"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_6ab3ec557a640017d53ac0e0ab7"`);
        await queryRunner.query(`DROP TABLE "employee"`);
    }

}
