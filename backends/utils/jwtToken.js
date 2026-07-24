import bcrypt from "bcryptjs";

const sendToken = async (
  user,
  statusCode,
  res
) => {
  try {
    // =========================
    // TOKENS
    // =========================

    const accessToken =
      user.getAccessToken();

    const refreshToken =
      await user.getRefreshToken();

    // =========================
    // COOKIE CONFIG
    // =========================

    const isSecure =
      process.env.NODE_ENV ===
      "production";

    const cookieOptions = (
      expiresIn
    ) => ({
      expires: new Date(
        Date.now() + expiresIn
      ),

      httpOnly: true,

      secure: isSecure,

      sameSite: isSecure
        ? "None"
        : "Lax",

      path: "/",
    });

    // =========================
    // RESPONSE
    // =========================

    return res
      .status(statusCode)

      .cookie(
        "accessToken",
        accessToken,
        cookieOptions(
          15 * 30 * 1000
        )
      )

      .cookie(
        "refreshToken",
        refreshToken,
        cookieOptions(
          7 *
          24 *
          60 *
          60 *
          1000
        )
      )

      .json({
        success: true,

        message:
          "Login successful",

        user: {
          role: {
            role_key:
              user?.role
                ?.role_key,
          },
        },
      });

  } catch (err) {
    console.error(
      "💥 sendToken error:",
      err
    );

    return res.status(500).json({
      success: false,

      message:
        "Internal Server Error",
    });
  }
};

export default sendToken;