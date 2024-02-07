import { DateTime } from 'luxon';
import Env from '@ioc:Adonis/Core/Env';
import { BaseModel, column, hasMany, belongsTo, HasMany, BelongsTo } from '@ioc:Adonis/Lucid/Orm';

import ProductCategory from 'App/Models/ProductCategory';
import ProductImage from 'App/Models/ProductImage';

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public title: string;

  @column()
  public description: string;

  @column()
  public price: number;

  @column()
  public categoryId: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => ProductCategory, {
    foreignKey: 'categoryId',
  })
  public productCategory: BelongsTo<typeof ProductCategory>;

  @hasMany(() => ProductImage)
  public productImage: HasMany<typeof ProductImage>;

  public serializeExtras() {
    return {
      url: `${Env.get('URL')}/produto/${this.id}`,
    };
  }
}
