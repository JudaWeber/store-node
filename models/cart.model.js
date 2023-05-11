const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  productPrice: { type: String, required: true },
  productDescription: { type: String, required: true },
  productImg: { type: String, required: true },
  productQuantity: { type: Number, required: true },
});

const Carts = mongoose.model("carts", CartSchema);

const addToCart = (
  userId,
  productId,
  productName,
  productPrice,
  productDescription,
  productImg,
  productQuantity
) => {
  const cart = new Carts({
    userId,
    productId,
    productName,
    productPrice,
    productDescription,
    productImg,
    productQuantity,
  });
  return cart.save();
};

const alreadyExistsInCart = (userId, productId) => {
  return Carts.findOne({ userId: userId, productId: productId });
};

const showItemById = (id) => {
  return Carts.findById(id);
};

const updateItemById = (id, productQuantity) => {
  return Carts.findByIdAndUpdate(
    id,
    {
      productQuantity,
    },
    { returnDocument: "after" }
  );
};

const showAllCartByUserId = (userId) => {
  return Carts.find({ userId: userId });
};

const deleteCartItemById = (id) => {
  return Carts.findByIdAndDelete(id);
};

const adminUpdateMany = (
  productId,
  productName,
  productPrice,
  productDescription,
  productImg
) => {
  return Carts.updateMany(
    { productId },
    {
      productName,
      productPrice,
      productDescription,
      productImg,
    },
    { returnDocument: "after" }
  );
};

const adminDeleteMany = (productId) => {
  return Carts.deleteMany(productId);
};

module.exports = {
  addToCart,
  alreadyExistsInCart,
  showItemById,
  updateItemById,
  showAllCartByUserId,
  deleteCartItemById,
  adminUpdateMany,
  adminDeleteMany,
};
