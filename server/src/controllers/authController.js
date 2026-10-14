import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function signup(req, res, next) {
  const { name, email, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
    });

    return res.status(201).json({
      message: "Account created successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    return next(error);
  }
}

export async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+passwordHash");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({}, process.env.JWT_SECRET, {
      subject: user._id.toString(),
      expiresIn: "1h",
      algorithm: "HS256",
      issuer: "receiptbox",
      audience: "receiptbox-web",
    });

    res.set("Cache-Control", "no-store");

    return res.status(200).json({
      message: "Login successful",
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return next(error);
  }
}
