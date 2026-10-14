import "dotenv/config";
import express from "express";

import { connectDB } from "./config/db.js";
import receiptRoutes from "./routes/receiptRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import User from "./models/User.js";

const app = express();

const PORT = Number(process.env.PORT) || 5050;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("ReceiptBox backend is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/receipts", receiptRoutes);

// सभी routes के बाद
app.use(notFound);

// सबसे आखिर में error middleware
app.use(errorHandler);

async function startServer() {
  try {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      throw new Error("JWT_SECRET must contain at least 32 characters");
    }

    await connectDB();
    await User.init();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.name);
    process.exit(1);
  }
}

startServer();
