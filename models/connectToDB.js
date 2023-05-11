const mongoose = require("mongoose");

module.exports = mongoose.connect(process.env.CONSTR);
// module.exports = mongoose.connect("mongodb://localhost:27017/bizcardsdb");
