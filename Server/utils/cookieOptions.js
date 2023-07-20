const cookieOptions = {
  expires: new Date(Date.now() + 2 * 24 * 3600000), // 2 days
  httpOnly: true,
  sameSite: "None",
  secure: true,
  // domain: process.env.DOMAIN,
};

export default cookieOptions;
