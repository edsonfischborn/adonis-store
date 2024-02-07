import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import ProductImage from 'App/Models/ProductImage';

export default class ProductImageSeeder extends BaseSeeder {
  public async run() {
    await ProductImage.createMany([
      {
        format: 'jpg',
        originalTitle: 'valvula-1',
        title: `ct-1-1623515978049`,
        productId: 1,
      },
      {
        format: 'jpg',
        originalTitle: 'valvula-2',
        title: `ct-1-1623515978050`,
        productId: 1,
      },
      {
        format: 'jpg',
        originalTitle: 'oleo-1',
        title: `ct-2-1623515978051`,
        productId: 2,
      },
    ]);
  }
}
