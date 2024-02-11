function NotFound(req, res, next) {
  const error = new Error(`Not Found ${req.originalUrl}`);
  res.status(404);
  next(error);
}
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err); // Do not proceed if headers have already been sent
  }
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  if (err.name == "castError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  }
  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV == "production" ? null : err.stack,
  });
}
module.exports = { NotFound, errorHandler };
