const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  isAdmin: { type: Boolean, default: false },
});

const Users = mongoose.model("users", usersSchema);

const findUserByEmail = (email) => Users.findOne({ email });

const createNewUser = (userData) => {
  const newUser = new Users(userData);
  return newUser.save();
};

const updatePasswordById = (id, password) => {
  return Users.findByIdAndUpdate(id, { password });
};

const showAllUsers = () => {
  return Users.find({});
};

const showUserById = (id) => {
  return Users.findById(id);
};

const updateUserById = (id, name, email, password, phone, isAdmin) => {
  return Users.findByIdAndUpdate(
    id,
    {
      name,
      email,
      password,
      phone,
      isAdmin,
    },
    { returnDocument: "after" }
  );
};

const deleteUserById = (id) => {
  return Users.findByIdAndDelete(id);
};

module.exports = {
  findUserByEmail,
  createNewUser,
  updatePasswordById,
  showAllUsers,
  showUserById,
  updateUserById,
  deleteUserById,
};
