import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Products extends BaseSchema {
  protected tableName = 'products';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.string('title').unique().notNullable();
      table.text('description');
      table.float('price').notNullable();

      table
        .integer('category_id')
        .unsigned()
        .references('product_categories.id')
        .onDelete('CASCADE');

      table.timestamps(true, true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
