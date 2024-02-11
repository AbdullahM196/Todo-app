const { allowedOrigins } = require("../config/corsOptions");

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    console.log("******allowed******");
    res.header("Access-Control-Allow-Origin", origin);
    res.header(
      "Access-Control-Allow-Methods",
      "GET,PUT,POST,DELETE,OPTIONS,PATCH"
    );
    res.setHeader("Content-Type", "application/json");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Content-Length, X-Requested-With"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
    } else {
      next();
    }
  } else {
    next();
  }
};

module.exports = credentials;
