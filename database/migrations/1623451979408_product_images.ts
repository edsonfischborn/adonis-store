import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class ProductImages extends BaseSchema {
  protected tableName = 'product_images';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.string('format').notNullable();
      table.string('title').unique().notNullable();
      table.string('original_title').notNullable();

      table
        .integer('product_id')
        .notNullable()
        .unsigned()
        .references('products.id')
        .onDelete('CASCADE');

      table.timestamps(true, true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
