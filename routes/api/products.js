const express = require("express");
const router = express.Router();
const {
  validateNewProductSchema,
  validateUpdateProductSchema,
  validateDeleteProductSchema,
  validateFindByIdProductSchema,
} = require("../../validation/product.validation");
const {
  createNewProduct,
  showAllProducts,
  showProductById,
  updateProductById,
  deleteProductById,
} = require("../../models/products.model");
const authMiddleware = require("../../middleware/auth.middleware");
const allowModifyMiddleware = require("../../middleware/allowModify.middleware");

router.post(
  "/add-product",
  authMiddleware,
  allowModifyMiddleware,
  async (req, res) => {
    try {
      const validatedValue = await validateNewProductSchema(req.body);
      if (req.userData.allowAccess) {
        const newProduct = await createNewProduct(
          validatedValue.name,
          validatedValue.price,
          validatedValue.description,
          validatedValue.img,
          req.userData.id
        );
        res.json({ msg: "product created", newProduct }).status(201);
      } else {
        throw "unotherized request";
      }
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }
);

router.get("/all-products", async (req, res) => {
  try {
    const allProducts = await showAllProducts();
    res.json(allProducts).status(200);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.get("/getproductbyid/:id", async (req, res) => {
  try {
    const validatedValue = await validateFindByIdProductSchema(req.params);
    const productData = await showProductById(validatedValue.id);
    res.json(productData).status(200);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.patch(
  "/updateproduct",
  authMiddleware,
  allowModifyMiddleware,
  async (req, res) => {
    try {
      const validatedValue = await validateUpdateProductSchema(req.body);
      const productData = await showProductById(validatedValue._id);
      if (!productData) throw "product does not exists";
      if (req.userData.allowAccess) {
        await updateProductById(
          validatedValue._id,
          validatedValue.name,
          validatedValue.price,
          validatedValue.description,
          validatedValue.img
        );
      } else {
        throw "operation invalid aka unauthorized";
      }
      res.json({ msg: "product updated" }).status(200);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }
);

router.delete(
  "/deleteproduct/:id",
  authMiddleware,
  allowModifyMiddleware,
  async (req, res) => {
    try {
      const validatedValue = await validateDeleteProductSchema(req.params);
      const itemData = await showProductById(validatedValue.id);
      if (!itemData) throw "item does not exists";
      if (req.userData.allowAccess) {
        await deleteProductById(validatedValue.id);
      }
      res.status(200).json({ msg: "product deleted" });
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }
);

module.exports = router;
