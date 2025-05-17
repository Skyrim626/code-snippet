const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    // Log the error to the console
    console.error(err);

    // Call the next middleware with the error
    next(err);
  });
};

export default asyncHandler;
