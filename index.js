require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoute = require("./Routes/userRoutes");
const todoRoute = require("./Routes/todoRoutes");
const favoriteRoute = require("./Routes/favoriteRoutes");
const categoryRoute = require("./Routes/catgeoryRoutes");
const dbConnect = require("./config/connectTodb");
const { NotFound, errorHandler } = require("./middleware/errorHandling");
const { corsOptions } = require("./config/corsOptions");
const credentials = require("./middleware/credentials");
app.use(credentials);
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
dbConnect();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/user", userRoute);
app.use(express.static("./Images"));
app.use("/api/todo", todoRoute);
app.use("/api/favorite", favoriteRoute);
app.use("/api/category", categoryRoute);

app.use(NotFound);
app.use(errorHandler);
const PORT = process.env.PORT || 3000;
// Listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
