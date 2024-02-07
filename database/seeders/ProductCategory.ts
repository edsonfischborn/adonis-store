import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import ProductCategory from 'App/Models/ProductCategory';

export default class ProductCategorySeeder extends BaseSeeder {
  public async run() {
    await ProductCategory.createMany([
      {
        title: 'peças',
      },
      {
        title: 'oleos',
      },
    ]);
  }
}
