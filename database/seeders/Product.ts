import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Product from 'App/Models/Product';

export default class ProductSeeder extends BaseSeeder {
  public async run() {
    await Product.createMany([
      {
        categoryId: 1,
        title: 'Válvula de Admissão e molas PRO-X',
        price: 1044.9,
        description:
          'As válvulas de admissão e molas Pro-x são fabricadas em aço para aumentar sua durabilidade em extremas condições de uso, são usinadas e oferecem um acabamento excelente, enquanto sua superfície diminui drasticamente a fricção entre a haste e a guia. ',
      },
      {
        categoryId: 2,
        title: 'Óleo Suspensão Motul Fork',
        price: 118.66,
        description:
          'Fluido hidráulico 100% sintético especialmente desenvolvido para uso em garfos de suspensão de motocicletas de competição. Especialmente formulado para garfos CAYABA, SHOWA, OHLINS, WP assim como para todos os tipos de garfos telescópicos invertidos ou convencionais. ',
      },
    ]);
  }
}
