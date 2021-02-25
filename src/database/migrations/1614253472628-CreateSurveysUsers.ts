import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateSurveysUsers1614253472628 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'Surveys_Users',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                    },
                    {
                        name: 'survey_id',
                        type: 'uuid',
                    },
                    {
                        name: 'value',
                        type: 'number',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()'
                    }
                ],
                foreignKeys: [
                    {
                        name: 'FK_user',
                        referencedTableName: 'Users',
                        referencedColumnNames: ['id'],
                        columnNames: ['user_id'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    },
                    {
                        name: 'FK_survey',
                        referencedTableName: 'Surveys',
                        referencedColumnNames: ['id'],
                        columnNames: ['survey_id'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    },
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropTable('Surveys_Users')
    }

}
