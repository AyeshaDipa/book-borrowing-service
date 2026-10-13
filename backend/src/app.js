const dashboardRoutes = require("./routes/dashboard.routes");

const userRoutes = require("./routes/user.routes");

const express = require("express");

const cors = require("cors");

const bookRoutes = require("./routes/book.routes");

const errorHandler = require("./middlewares/error.middleware");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/dashboard", dashboardRoutes);

app.use("/books", bookRoutes);

app.use("/auth", userRoutes);

app.use(errorHandler);

module.exports = app;