const allowedCategories = [
  "Food",
  "Travel",
  "Medical",
  "Office",
  "Shopping",
  "Utilities",
  "Other",
];

export function validateReceipt(req, res, next) {
  const { merchant, amount, category, date } = req.body ?? {};

  if (typeof merchant !== "string" || merchant.trim() === "") {
    return res.status(400).json({
      message: "Merchant name is required",
    });
  }

  if (typeof amount !== "number" || !Number.isFinite(amount) || amount < 0.01) {
    return res.status(400).json({
      message: "Amount must be a number of at least 0.01",
    });
  }

  if (
    typeof category !== "string" ||
    !allowedCategories.includes(category.trim())
  ) {
    return res.status(400).json({
      message: "Please select a valid category",
    });
  }

  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({
      message: "Date must be in YYYY-MM-DD format",
    });
  }

  const parsedDate = new Date(date);

  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== date
  ) {
    return res.status(400).json({
      message: "Please provide a real calendar date",
    });
  }

  next();
}
