/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route';

// Home
Route.get('/', async (ctx) => {
  const { default: ProductController } = await import('App/Controllers/Http/ProductsController');
  return new ProductController().index(ctx);
});

// ProductsController
Route.resource('produto', 'ProductsController').except(['create', 'edit', 'index']);

// Admin
Route.get('/admin', async (ctx) => {
  const { default: AdminController } = await import('App/Controllers/Http/AdminController');
  return new AdminController().index(ctx);
});

Route.get('/admin/deletar/:id', async (ctx) => {
  const { default: AdminController } = await import('App/Controllers/Http/AdminController');
  return new AdminController().delete(ctx);
});

Route.get('/admin/editar/:id', async (ctx) => {
  const { default: AdminController } = await import('App/Controllers/Http/AdminController');
  return new AdminController().update(ctx);
});

// Files
Route.get('uploads/products/:filename', async ({ params, response }) => {
  const { default: Application } = await import('@ioc:Adonis/Core/Application');
  return response.attachment(Application.tmpPath('uploads/products', params.filename));
});
