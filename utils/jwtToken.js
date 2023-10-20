// Create Token and saving in cookie

const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  res.cookie("token", token, {
    maxAge: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: "None",
    secure: true
  }).status(statusCode).json({
    success: true,
    user,
    token,
  });
};

export default sendToken;