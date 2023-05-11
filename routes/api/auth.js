const express = require("express");
const router = express.Router();
const {
  validateRegisterSchema,
  validateLoginSchema,
  validateForgotPasswordSchema,
  validateUpdateUserSchema,
  validateDeleteUserSchema,
  validateResetPasswordSchema,
} = require("../../validation/auth.validation");
const {
  findUserByEmail,
  createNewUser,
  updatePasswordById,
  showAllUsers,
  showUserById,
  updateUserById,
  deleteUserById,
} = require("../../models/users.model");
const { createHash, cmpHash } = require("../../config/bcrypt.js");
const { genToken, verifyToken } = require("../../config/jwt");
const authMiddleware = require("../../middleware/auth.middleware");
const adminOnlyMiddleware = require("../../middleware/adminOnly.middleware");

router.post("/register/", async (req, res) => {
  try {
    const validatedValue = await validateRegisterSchema(req.body);
    const user = await findUserByEmail(validatedValue.email);
    if (user) {
      throw "try different email";
    }
    const hashedPassword = await createHash(validatedValue.password);
    validatedValue.password = hashedPassword;
    await createNewUser(validatedValue);
    res.status(201).json({ msg: "user created" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const validatedValue = await validateLoginSchema(req.body);
    const user = await findUserByEmail(validatedValue.email);
    if (!user) {
      throw "invalid email";
    }
    const isEqual = await cmpHash(validatedValue.password, user.password);
    if (!isEqual) {
      throw "invalid password";
    }
    const token = await genToken({
      name: user.name,
      email: user.email,
      id: user._id,
      isAdmin: user.isAdmin,
    });
    res.json({ token }).status(200);
  } catch (error) {
    res.json({ error }).status(400);
  }
});

router.post("/forgotpassword", async (req, res) => {
  try {
    const validatedValue = await validateForgotPasswordSchema(req.body);
    const userData = await findUserByEmail(validatedValue.email);
    if (!userData) throw "user dosent exist";
    const jwt = await genToken({ email: userData.email }, "1h");
    res
      .json({
        msg: "check your inbox",
        resetPasswordLink: "http://localhost:3000/resetpassword/" + jwt,
      })
      .status(200);
  } catch (error) {
    res.json({ msg: error }).status(400);
  }
});

router.post("/resetpassword/:token", async (req, res) => {
  try {
    const payload = await verifyToken(req.params.token);
    const userData = await findUserByEmail(payload.email);
    if (!userData) throw "something went wrong";
    const validatedValue = await validateResetPasswordSchema(req.body);
    const hashedPassword = await createHash(validatedValue.password);
    req.body.password = hashedPassword;
    await updatePasswordById(userData._id, hashedPassword);
    res.json({ msg: "password updated" }).status(200);
  } catch (err) {
    res.status(400).json({ err });
  }
});

router.get(
  "/showallusers",
  authMiddleware,
  adminOnlyMiddleware,
  async (req, res) => {
    try {
      if (req.userData.allowAccess) {
        const allusers = await showAllUsers();
        res.json(allusers).status(200);
      } else {
        throw "unauthrized request";
      }
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }
);

router.delete(
  "/deleteuser/:id",
  authMiddleware,
  adminOnlyMiddleware,
  async (req, res) => {
    try {
      const validatedValue = await validateDeleteUserSchema(req.params);
      const userInfo = await showUserById(validatedValue.id);
      if (!userInfo) throw "user does not exist";
      if (req.userData.allowAccess) {
        await deleteUserById(validatedValue.id);
      } else {
        throw "unauthrized request";
      }
      res.status(200).json({ msg: "user deleted" });
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }
);

router.get("/userInfo", authMiddleware, async (req, res) => {
  try {
    res.json(req.userData);
  } catch (error) {
    res.status(500).send(errorsFromMongoose);
  }
});

router.get("/getuserbyid/:id", async (req, res) => {
  try {
    const userData = await showUserById(req.params.id);
    res.json(userData).status(200);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.patch(
  "/updateuser",
  authMiddleware,
  adminOnlyMiddleware,
  async (req, res) => {
    try {
      const validatedValue = await validateUpdateUserSchema(req.body);
      const userInfo = await showUserById(req.body.id);
      if (!userInfo) throw "user does not exist";

      if (req.userData.allowAccess) {
        const updatedUser = await updateUserById(
          validatedValue.id,
          validatedValue.name,
          validatedValue.email,
          validatedValue.password,
          validatedValue.phone,
          validatedValue.isAdmin
        );

        res.json({ msg: "user updated", updatedUser }).status(200);
      } else {
        throw "operation invalid aka unauthorized";
      }
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }
);

module.exports = router;
