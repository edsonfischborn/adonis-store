import { DateTime } from 'luxon';
import Env from '@ioc:Adonis/Core/Env';
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm';

export default class ProductImage extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public format: string;

  @column()
  public title: string;

  @column()
  public originalTitle: string;

  @column()
  public productId: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  public serializeExtras() {
    return {
      url: `${Env.get('URL')}/uploads/products/${this.title}.${this.format}`,
    };
  }
}
