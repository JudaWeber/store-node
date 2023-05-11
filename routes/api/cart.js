const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth.middleware");
const allowModifyMiddleware = require("../../middleware/allowModify.middleware");
const {
  addToCart,
  alreadyExistsInCart,
  showItemById,
  updateItemById,
  showAllCartByUserId,
  deleteCartItemById,
  adminUpdateMany,
  adminDeleteMany,
} = require("../../models/cart.model");

const {
  validateAddToCartSchema,
  validateUpdateQuantitySchema,
  validateDeleteItemFromCartSchema,
  validateAdminUpdateSchema,
} = require("../../validation/cart.validation");

router.post("/addtocart", authMiddleware, async (req, res) => {
  try {
    const validatedValue = await validateAddToCartSchema(req.body);
    const itemAdded = await addToCart(
      req.userData.id,
      validatedValue.productId,
      validatedValue.productName,
      validatedValue.productPrice,
      validatedValue.productDescription,
      validatedValue.productImg,
      validatedValue.productQuantity
    );
    res.json({ msg: "product created", itemAdded }).status(201);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.get("/:userId/cart/:productId", authMiddleware, async (req, res) => {
  try {
    const existingCartItem = await alreadyExistsInCart(
      req.params.userId,
      req.params.productId
    );
    if (existingCartItem) {
      res.json({ msg: "already exists", existingCartItem }).status(200);
    } else {
      res.json({ msg: "it does not exists in the cart" }).status(200);
    }
  } catch (error) {
    res.json({ error: error }).status(400);
  }
});

router.patch("/updatecart", authMiddleware, async (req, res) => {
  try {
    const validatedValue = await validateUpdateQuantitySchema(req.body);
    const itemData = await showItemById(validatedValue._id);
    if (!itemData) throw "item does not exists";

    itemData.productQuantity += validatedValue.productQuantity;
    const updatedItem = await updateItemById(
      validatedValue._id,
      itemData.productQuantity
    );
    res.json({ msg: "product updated", updatedItem }).status(200);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.patch("/updatecartfrommycartpage", authMiddleware, async (req, res) => {
  try {
    const validatedValue = await validateUpdateQuantitySchema(req.body);
    const itemData = await showItemById(validatedValue._id);
    if (!itemData) throw "item does not exists";
    itemData.productQuantity = validatedValue.productQuantity;
    const updatedItem = await updateItemById(
      validatedValue._id,
      itemData.productQuantity
    );
    res.json({ msg: "product updated" }).status(200);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.get("/my-cart", authMiddleware, async (req, res) => {
  try {
    const allItemsInCart = await showAllCartByUserId(req.userData.id);
    res.json(allItemsInCart).status(200);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.delete("/deleteitemfromcart/:id", authMiddleware, async (req, res) => {
  try {
    const validatedValue = await validateDeleteItemFromCartSchema(req.params);
    const itemData = await showItemById(validatedValue.id);
    if (!itemData) throw "item does not exists";
    if (itemData.userId === req.userData.id) {
      await deleteCartItemById(validatedValue.id);
    }
    res.status(200).json({ msg: "product deleted" });
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.patch(
  "/adminupdate",
  authMiddleware,
  allowModifyMiddleware,
  async (req, res) => {
    try {
      const validatedValue = await validateAdminUpdateSchema(req.body);
      const updatedItems = await adminUpdateMany(
        validatedValue.productId,
        validatedValue.productName,
        validatedValue.productPrice,
        validatedValue.productDescription,
        validatedValue.productImg
      );

      res.json({ msg: "product updated", updatedItems }).status(200);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }
);

router.delete(
  "/admindelete",
  authMiddleware,
  allowModifyMiddleware,
  async (req, res) => {
    try {
      if (req.userData.allowAccess) {
        const deletedItems = await adminDeleteMany(req.body.productId);
        res.json({ msg: "product updated", deletedItems }).status(200);
      }
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }
);

module.exports = router;
