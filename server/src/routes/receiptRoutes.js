import express from "express";
import { validateReceipt } from "../middlewares/validateReceipt.js";
import { protect } from "../middlewares/authMiddleware.js";

import {
  getReceipts,
  getReceiptById,
  createReceipt,
  updateReceipt,
  deleteReceipt,
} from "../controllers/receiptController.js";

const router = express.Router();

router.use(protect);

router.get("/", getReceipts);

router.get("/:id", getReceiptById);

router.post("/", validateReceipt, createReceipt);

router.put("/:id", validateReceipt, updateReceipt);

router.delete("/:id", deleteReceipt);

export default router;
