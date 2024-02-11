const allowedOrigins = ["http://localhost:5000"];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
    } else if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not Allowed by Cors"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
module.exports = { allowedOrigins, corsOptions };
