const mongoose = require('mongoose');
const Product = require('../models/Product');

mongoose
  .connect("mongodb+srv://tasovgun97:eDPriMmh039MHOb6@cluster0.droke3p.mongodb.net/idvlabtask?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected for migration"))
  .catch((err) => console.error(err));

const updateProducts = async () => {
  try {
    // Tüm ürünleri bul
    const products = await Product.find({});
    console.log(`${products.length} ürün bulundu.`);

    // Her ürün için eksik alanları güncelle
    for (const product of products) {
      const updates = {};

      // Price kontrolü
      if (!product.price) {
        updates.price = 100;
      }

      // Status kontrolü
      if (!product.status) {
        updates.status = 'published';
      }

      // isEnabled kontrolü
      if (product.isEnabled === undefined) {
        updates.isEnabled = true;
      }

      // soldQuantity kontrolü
      if (!product.soldQuantity) {
        updates.soldQuantity = 100;
      }

      // Eğer güncellenecek alan varsa güncelle
      if (Object.keys(updates).length > 0) {
        await Product.findByIdAndUpdate(product._id, updates);
        console.log(`${product.name} güncellendi:`, updates);
      }
    }

    console.log('Tüm ürünler güncellendi.');
    process.exit(0);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
};

updateProducts(); 