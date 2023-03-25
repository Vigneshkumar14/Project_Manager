import config from "../config/index.js";
const cookieOptions = {
  expires: new Date(Date.now() + 2 * 24 * 3600000), // 2 days

  //   httpOnly: true,
  //   sameSite: "none",
  //   secure: true,
};

export default cookieOptions;
