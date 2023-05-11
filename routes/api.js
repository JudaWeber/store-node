const express = require("express");
const router = express.Router();
const productRouter = require("./api/products");
const authRouter = require("./api/auth");
const cartRouter = require("./api/cart");

router.use("/products", productRouter);
router.use("/auth", authRouter);
router.use("/cart", cartRouter);

module.exports = router;
