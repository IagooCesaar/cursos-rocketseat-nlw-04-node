import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateSurveys1614168617124 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'Surveys',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true
                    },{
                      name: 'title',
                      type: 'varchar',                      
                    },{
                      name: 'description',
                      type: 'varchar',                      
                    },{
                      name: 'created_at',
                      type: 'date',                      
                      default: 'now()'
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('Surveys')
    }

}
