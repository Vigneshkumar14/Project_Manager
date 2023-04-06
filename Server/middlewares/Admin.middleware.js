import asyncHandler from "../services/asyncHandler.js";

export const isAdmin = asyncHandler((req, res, next) => {
  const user = req.user;

  if (!user || req.user.role != 1)
    return res.status(200).json({
      success: false,
      message: "Unauthorized to access this route",
    });

  next();
});
