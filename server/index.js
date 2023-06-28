const express = require("express");
const mongoose = require("mongoose");

const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const productRouter = require("./routes/products");
const userRouter = require("./routes/user");
const orderRouter = require("./routes/order");

const PORT = process.env.PORT || 3000;
const DB =
  "mongodb+srv://ahsan:AliK1122@cluster0.pxmafpb.mongodb.net/?retryWrites=true&w=majority";

//Creating a server

const app = express();

app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);
app.use(orderRouter);

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection successful!");
  })
  .catch((e) => {
    console.log(e.log);
  });

app.listen(PORT, "0.0.0.0", () => {
  console.log(`listening at ${PORT}`);
});
