import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import User from 'App/Models/User';

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        firstname: 'Édson',
        lastname: 'Fischborn',
        password: '1234567',
        email: 'edsonfischborn@gmail.com',
      },
    ]);
  }
}
