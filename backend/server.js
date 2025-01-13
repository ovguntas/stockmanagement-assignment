const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const StockLog = require("./models/StockLog");

const app = express();
const PORT = 3333;
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas bağlantısı
mongoose
  .connect("mongodb+srv://tasovgun97:eDPriMmh039MHOb6@cluster0.droke3p.mongodb.net/idvlabtask?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));


const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  tag: { type: String, enum: ["kırtasiye", "temizlik", "diğer"], required: true },
  imageUrl: { type: String },
});

const Product = mongoose.model("Product", productSchema);

// CRUD Rotaları
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/add-product", async (req, res) => {
  const product = new Product(req.body);
  try {
    const savedProduct = await product.save();
    
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }

    const previousQuantity = product.quantity;
    const newQuantity = req.body.quantity;

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // Create log
    await StockLog.create({
      productId: product._id,
      productName: product.name,
      previousQuantity,
      newQuantity,
      operationType: previousQuantity > newQuantity ? 'decrease' : 'update'
    });

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all stock logs
app.get("/stock-logs", async (req, res) => {
  try {
    const logs = await StockLog.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
