const mongoose = require("mongoose");
const UserRouter = require("./routes/userRouter");
const AccountRouter = require("./routes/accountRouter");
const app = require("./modules/expressSettings");
require("./modules/envConfig");

const db = process.env.DATABASE || "";

(async () => {
  try {
    await mongoose.connect(db);
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Error: " + error.message);
  }
})();

// Users Router
app.use("/api/v1/users", UserRouter);

// Account Router
app.use("/api/v1/account", AccountRouter);

module.exports = app;