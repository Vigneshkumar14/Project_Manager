const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    console.log("Async Handler", err);
    return res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
};

export default asyncHandler;
