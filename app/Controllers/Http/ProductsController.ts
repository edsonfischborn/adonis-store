import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm';
import Application from '@ioc:Adonis/Core/Application';
import Env from '@ioc:Adonis/Core/Env';
import { cuid } from '@ioc:Adonis/Core/Helpers';
import { unlink } from 'fs';

import Product from 'App/Models/Product';
import ProductCategory from 'App/Models/ProductCategory';
import ProductImages from 'App/Models/ProductImage';

export default class ProductsController {
  async index({ view, request }: HttpContextContract) {
    const page = Number(request.input('pagina', 1)) || 1;
    const category = Number(request.input('categoria', 0)) || 0;

    const categories = await ProductCategory.all();
    let products: ModelPaginatorContract<Product> | null = null;

    if (category === 0) {
      products = await Product.query().preload('productImage').paginate(page, 9);
    } else {
      products = await Product.query()
        .where('category_id', category)
        .preload('productImage')
        .paginate(page, 9);
    }

    return await view.render('products', {
      products: products.all().map((p) => p.serialize()),
      categories: categories.map((c) => c.serialize()),
      pagesIndex: Array.from(Array(products.lastPage), (_, i) => i + 1),
      currentPage: products.currentPage,
      currentCategory: category,
    });
  }

  async show({ params, view, response }: HttpContextContract) {
    const product = await Product.find(params.id);

    if (!product) return response.redirect(Env.get('URL'));

    await product.load('productImage');

    const relatedProducts = await Product.query()
      .where('category_id', product.categoryId)
      .where('id', '!=', params.id)
      .limit(4)
      .preload('productImage');

    return await view.render('product', {
      product: product.serialize(),
      relatedProducts: relatedProducts.map((p) => p.serialize()),
    });
  }

  async store({ request, response }: HttpContextContract) {
    try {
      const { title, description, price, category } = request.body();
      const images = request.files('images', {
        size: '5mb',
        extnames: ['jpg', 'png'],
      });

      if (images.length === 0 || !title || !description || !price || !category) {
        return response.redirect(Env.get('URL'));
      }

      const imagesData: Array<any> = [];
      let imageError = false;

      images.forEach(async (image) => {
        if (!image.isValid) {
          imageError = true;
          return;
        }

        const name = `ct-${category}-${cuid()}`;
        imagesData.push({
          title: name,
          originalTitle: image.clientName,
          format: image.extname,
        });

        await image.move(Application.tmpPath('uploads/products'), {
          name: `${name}.${image.extname}`,
        });
      });

      if (imageError) {
        imagesData.forEach((data) => {
          const path = `${Application.tmpPath('uploads/products')}/${data.title}.${data.format}`;
          unlink(path, () => null);
        });

        throw new Error('Invalid images');
      }

      const product = await Product.create({
        categoryId: category,
        title,
        price,
        description,
      });

      if (product.$isPersisted) {
        await ProductImages.createMany(
          imagesData.map((data) => ({ ...data, productId: product.id }))
        );
      }
    } catch (err) {
    } finally {
      return response.redirect().back();
    }
  }

  async update({ request, response, params }: HttpContextContract) {
    try {
      const { title, description, price, category } = request.body();
      const images = request.files('images', {
        size: '5mb',
        extnames: ['jpg', 'png'],
      });

      const product = await Product.find(params.id);

      if (!product) return response.redirect(Env.get('URL'));

      if (images.length === 0 || !title || !description || !price || !category) {
        return response.redirect(Env.get('URL'));
      }

      const imagesData: Array<any> = [];
      let imageError = false;

      images.forEach(async (image) => {
        if (!image.isValid) {
          imageError = true;
          return;
        }

        const name = `ct-${category}-${cuid()}`;
        imagesData.push({
          title: name,
          originalTitle: image.clientName,
          format: image.extname,
        });

        await image.move(Application.tmpPath('uploads/products'), {
          name: `${name}.${image.extname}`,
        });
      });

      if (imageError) {
        imagesData.forEach((data) => {
          const path = `${Application.tmpPath('uploads/products')}/${data.title}.${data.format}`;
          unlink(path, () => null);
        });

        throw new Error('Invalid images');
      }

      const persistedProduct = await product
        .merge({
          categoryId: category,
          title,
          price,
          description,
        })
        .save();

      if (persistedProduct.$isPersisted) {
        await persistedProduct.load('productImage');
        const serializedProduct = persistedProduct.serialize();
        serializedProduct.productImage.forEach((data) => {
          const path = `${Application.tmpPath('uploads/products')}/${data.title}.${data.format}`;
          unlink(path, () => null);
        });

        await ProductImages.query().where('product_id', serializedProduct.id).delete();
        await ProductImages.createMany(
          imagesData.map((data) => ({ ...data, productId: serializedProduct.id }))
        );
      }
    } catch (err) {
    } finally {
      response.redirect(`${Env.get('URL')}/admin`);
    }
  }

  async destroy({ params, response }: HttpContextContract) {
    const product = await Product.find(params.id);

    if (!product) return response.redirect(Env.get('URL'));

    await product.load('productImage');
    const serializedProduct = product.serialize();

    await product.delete();

    serializedProduct.productImage.forEach((img) => {
      unlink(`${Application.tmpPath('uploads/products')}/${img.title}.${img.format}`, () => null);
    });

    return response.redirect(`${Env.get('URL')}/admin`);
  }
}
