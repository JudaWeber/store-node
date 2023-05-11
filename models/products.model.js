const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productsSchema = new Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String },
  img: { type: String, required: true },
  ownerId: { type: String },
});

const Products = mongoose.model("product", productsSchema);

const createNewProduct = (name, price, description, img, ownerId) => {
  const product = new Products({
    name,
    price,
    description,
    img,
    ownerId,
  });
  return product.save();
};

const showAllProducts = () => {
  return Products.find({});
};

const showProductById = (id) => {
  return Products.findById(id);
};

const updateProductById = (id, name, price, description, img) => {
  return Products.findByIdAndUpdate(
    id,
    {
      name,
      price,
      description,
      img,
    },
    { returnDocument: "after" }
  );
};

const deleteProductById = (id) => {
  return Products.findByIdAndDelete(id);
};

module.exports = {
  createNewProduct,
  showAllProducts,
  showProductById,
  updateProductById,
  deleteProductById,
};
