import mongoose from "mongoose";
import Receipt from "../models/Receipt.js";

// POST और PUT में यही validation इस्तेमाल होगी।
function validateReceipt(data) {
  const { merchant, amount, category, date } = data;

  if (typeof merchant !== "string" || merchant.trim() === "") {
    return "Merchant name is required";
  }

  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    return "Amount must be a number greater than 0";
  }

  if (typeof category !== "string" || category.trim() === "") {
    return "Category is required";
  }

  if (typeof date !== "string" || date.trim() === "") {
    return "Date is required";
  }

  return null;
}

// 1. सभी receipts निकालना
export async function getReceipts(req, res, next) {
  try {
    const receipts = await Receipt.find({
      user: req.user._id,
    });

    return res.status(200).json({
      message: "Receipts fetched successfully",
      data: receipts,
    });
  } catch (error) {
    return next(error);
  }
}

// 2. एक receipt निकालना
export async function getReceiptById(req, res, next) {
  const { id } = req.params;

  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).json({
      message: "Invalid receipt ID",
    });
  }

  try {
    const receipt = await Receipt.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!receipt) {
      return res.status(404).json({
        message: "Receipt not found",
      });
    }

    return res.status(200).json({
      message: "Receipt fetched successfully",
      data: receipt,
    });
  } catch (error) {
    return next(error);
  }
}

// 3. नई receipt बनाना
export async function createReceipt(req, res, next) {
  const { merchant, amount, category, date } = req.body;

  try {
    const receipt = await Receipt.create({
      user: req.user._id,
      merchant: merchant.trim(),
      amount,
      category: category.trim(),
      date: date.trim(),
    });

    return res.status(201).json({
      message: "Receipt saved in MongoDB",
      data: receipt,
    });
  } catch (error) {
    return next(error);
  }
}

// 4. Existing receipt update करना
export async function updateReceipt(req, res, next) {
  const { id } = req.params;

  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).json({
      message: "Invalid receipt ID",
    });
  }

  const { merchant, amount, category, date } = req.body;

  try {
    const receipt = await Receipt.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!receipt) {
      return res.status(404).json({
        message: "Receipt not found",
      });
    }

    receipt.merchant = merchant.trim();
    receipt.amount = amount;
    receipt.category = category.trim();
    receipt.date = date.trim();

    await receipt.save();

    return res.status(200).json({
      message: "Receipt updated successfully",
      data: receipt,
    });
  } catch (error) {
    return next(error);
  }
}

// 5. Receipt delete करना
export async function deleteReceipt(req, res, next) {
  const { id } = req.params;

  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).json({
      message: "Invalid receipt ID",
    });
  }

  try {
    const receipt = await Receipt.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!receipt) {
      return res.status(404).json({
        message: "Receipt not found",
      });
    }

    return res.status(200).json({
      message: "Receipt deleted successfully",
      data: receipt,
    });
  } catch (error) {
    return next(error);
  }
}
