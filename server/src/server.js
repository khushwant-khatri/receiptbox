import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

import { connectDB } from "./config/db.js";
import receiptRoutes from "./routes/receiptRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import User from "./models/User.js";

const app = express();

const PORT = Number(process.env.PORT) || 5050;
const isProduction = process.env.NODE_ENV === "production";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

const clientDist = path.resolve(currentDirectory, "../../client/dist");

app.use(express.json());

// API routes must come before frontend routes.
app.use("/api/auth", authRoutes);
app.use("/api/receipts", receiptRoutes);

// Unknown API URLs should return JSON, not the React page.
app.use("/api", notFound);

if (isProduction) {
  app.use(express.static(clientDist));

  app.get("/{*splat}", (req, res, next) => {
    // Missing assets should return 404.
    if (path.extname(req.path) || !req.accepts("html")) {
      return next();
    }

    return res.sendFile(path.join(clientDist, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("ReceiptBox backend is running");
  });
}

app.use(notFound);
app.use(errorHandler);

async function startServer() {
  try {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      throw new Error("JWT_SECRET must contain at least 32 characters");
    }

    if (isProduction && !existsSync(path.join(clientDist, "index.html"))) {
      throw new Error(
        "Frontend build is missing. Run npm run build in client first.",
      );
    }

    await connectDB();
    await User.init();

    app.listen(PORT, "0.0.0.0", (error) => {
      if (error) {
        console.error("Server failed to listen:", error.code);
        process.exit(1);
      }

      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.name);

    if (
      error.message === "JWT_SECRET must contain at least 32 characters" ||
      error.message ===
        "Frontend build is missing. Run npm run build in client first."
    ) {
      console.error(error.message);
    }

    process.exit(1);
  }
}

startServer();
