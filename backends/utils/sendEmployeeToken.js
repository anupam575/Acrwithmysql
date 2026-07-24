import jwt from "jsonwebtoken";

const empToken = async (emp, statusCode, res) => {
  try {

    // 🔥 SAFETY CHECK
    if (!emp.employeeRefId) {
      return res.status(400).json({
        success: false,
        message: "Employee reference ID missing",
      });
    }

    // 🔥 ACCESS TOKEN
    const accessToken = jwt.sign(
      {
        id: emp._id,
        employeeRefId: emp.employeeRefId,
        email: emp.email,
        role: emp.role,
        type: "employee",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE || "15m",
      }
    );

    // 🔥 REFRESH TOKEN
    const refreshToken = jwt.sign(
      {
        id: emp._id,
        employeeRefId: emp.employeeRefId,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn:
          process.env.REFRESH_TOKEN_EXPIRE || "7d",
      }
    );

    const isSecure =
      process.env.NODE_ENV === "production";

    const cookieOptions = (expiresIn) => ({
      expires: new Date(Date.now() + expiresIn),
      httpOnly: true,
      secure: isSecure,
      sameSite: isSecure ? "None" : "Lax",
      path: "/",
    });

    return res
      .status(statusCode)
      .cookie(
        "accessToken",
        accessToken,
        cookieOptions(15 * 60 * 1000)
      )
      .cookie(
        "refreshToken",
        refreshToken,
        cookieOptions(
          7 * 24 * 60 * 60 * 1000
        )
      )
      .json({
        success: true,
        message: "Login successful",
        emp: {
          id: emp._id,
          employeeRefId: emp.employeeRefId,
          email: emp.email,
          role: emp.role,
        },
      });

  } catch (err) {

    console.error("💥 empToken error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export default empToken;