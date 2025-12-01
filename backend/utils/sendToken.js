export const sendToken = (user, statusCode, message, res) => {
  // Assuming user.generateToken() is a typo and should be user.getJWTToken()
  // as per the common convention and the fix suggested in the previous response.
  // I will use user.generateToken() if that is what your model actually uses.
  const token = user.generateToken();

  // Calculate the expiration date from the environment variable (e.g., 3 days)
  const expirationDate = new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
  );

  const cookieOptions = {
    expires: expirationDate,
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie

    // 👇️ CRITICAL FIX FOR LOCALHOST CROSS-ORIGIN (HTTP)
    secure: false, // Must be FALSE because you are using HTTP (localhost)
    sameSite: 'Lax', // Allows the cookie to be sent on cross-site requests
  };

  res.status(statusCode).cookie("token", token, cookieOptions).json({
    sucess: true,
    user,
    message,
    token,
  })
};
