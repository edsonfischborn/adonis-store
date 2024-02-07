import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm';
import Env from '@ioc:Adonis/Core/Env';
import Product from 'App/Models/Product';
import ProductCategory from 'App/Models/ProductCategory';

export default class AdminController {
  async index({ view, request }: HttpContextContract) {
    const page = Number(request.input('pagina', 1)) || 1;
    const category = Number(request.input('categoria', 0)) || 0;

    const categories = await ProductCategory.all();
    let products: ModelPaginatorContract<Product> | null = null;

    if (category === 0) {
      products = await Product.query().preload('productImage').paginate(page, 5);
    } else {
      products = await Product.query()
        .where('category_id', category)
        .preload('productImage')
        .paginate(page, 5);
    }

    return await view.render('admin', {
      products: products.all().map((p) => p.serialize()),
      categories: categories.map((c) => c.serialize()),
      pagesIndex: Array.from(Array(products.lastPage), (_, i) => i + 1),
      currentPage: products.currentPage,
      currentCategory: category,
    });
  }

  async delete({ view, params, response }: HttpContextContract) {
    const product = await Product.find(params.id);

    if (!product) return response.redirect(Env.get('URL'));
    await product.load('productImage');

    return await view.render('admin', {
      action: 'delete',
      product: product.serialize(),
    });
  }

  async update({ view, params, response }: HttpContextContract) {
    const product = await Product.find(params.id);

    if (!product) return response.redirect(Env.get('URL'));
    await product.load('productImage');
    const categories = await ProductCategory.all();

    return await view.render('admin', {
      action: 'update',
      product: product.serialize(),
      categories,
    });
  }
}
