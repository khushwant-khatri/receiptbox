import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";

export async function protect(req, res, next) {
  const authorization = req.get("Authorization"); //req.get("Authorization") → header पढ़ता है।

  const match = authorization?.match(/^Bearer\s+(\S+)$/i); //Bearer के बाद से token निकालता है।

  if (!match) {
    return res.status(401).json({
      message: "Please login to access this resource",
    });
  }

  const token = match[1];

  let decoded;

  try {
    //jwt.verify() → signature, expiry, algorithm, issuer और audience check करता है।
    decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: "receiptbox",
      audience: "receiptbox-web",
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token. Please login again",
    });
  }

  if (
    // decoded.sub → login के समय token में रखी हुई user ID।
    typeof decoded.sub !== "string" ||
    !mongoose.isObjectIdOrHexString(decoded.sub)
  ) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }

  try {
    // User.findById() → check करता है कि account अभी मौजूद है।
    const user = await User.findById(decoded.sub).select("_id name email");

    if (!user) {
      return res.status(401).json({
        message: "Account not found. Please login again",
      });
    }
    // req.user = user → verified user को request पर रखता है।
    req.user = user;

    next(); //next() → आगे controller चलने देता है।
  } catch (error) {
    return next(error);
  }
}
