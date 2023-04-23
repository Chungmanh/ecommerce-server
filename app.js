const express = require("express");
const cookieParser = require("cookie-parser");
const port = 8080;
const authRouter = require("./routes/auth.route");
const productRouter = require("./routes/product.route");
const categoryRouter = require("./routes/category.route");
const cartRouter = require("./routes/cart.route");
const orderRouter = require("./routes/order.route");
const reviewRouter = require("./routes/review.route");
const actionRouter = require("./routes/actions.route");

const cors = require("cors");
const app = express();
const connectDB = require("./_utils/connectDb");

//Connect to DB
connectDB();

app.use(cookieParser());

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.json()); // for parsing application/json

app.get("/", (req, res) => {
  console.log("hohoh");
  res.json("ecommerce");
});

app.use("/product", productRouter);
app.use("/category", categoryRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/review", reviewRouter);
app.use("/action", actionRouter);
app.use("/auth", authRouter);
// app.use("/backend/images", express.static("backend/images"));

app.listen(port, () => console.log(`listening port ${port}`));
