export function validateLogin(req, res, next) {
  const { email, password } = req.body ?? {};

  if (
    typeof email !== "string" ||
    email.trim().length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return res.status(400).json({
      message: "Please provide a valid email",
    });
  }

  if (
    typeof password !== "string" ||
    password.length === 0 ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    return res.status(400).json({
      message: "Please provide a valid password",
    });
  }

  next();
}
