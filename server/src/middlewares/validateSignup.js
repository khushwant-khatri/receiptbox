export function validateSignup(req, res, next) {
  const { name, email, password } = req.body ?? {};

  if (
    typeof name !== "string" ||
    name.trim().length < 2 ||
    name.trim().length > 100
  ) {
    return res.status(400).json({
      message: "Name must contain 2 to 100 characters",
    });
  }

  if (
    typeof email !== "string" ||
    email.trim().length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return res.status(400).json({
      message: "Please provide a valid email",
    });
  }

  if (typeof password !== "string" || password.length < 12) {
    return res.status(400).json({
      message: "Password must contain at least 12 characters",
    });
  }

  if (Buffer.byteLength(password, "utf8") > 72) {
    return res.status(400).json({
      message: "Password must not exceed 72 bytes",
    });
  }

  next();
}
