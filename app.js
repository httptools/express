const mongoose = require("mongoose");
const UserRouter = require("./routes/userRouter");
const app = require("./modules/expressSettings");
require("./modules/envConfig");

const db = process.env.DATABASE || "";

mongoose
  .connect(db)
  .then((con) => {
    console.log("Database connected successfully!");
  })
  .catch((error) => {
    console.error("Error: " + error.message);
  });

// Users Router
app.use("/api/v1/users", UserRouter);

module.exports = app;