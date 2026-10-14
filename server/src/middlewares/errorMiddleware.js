// किसी route से request match नहीं हुई
export function notFound(req, res) {
  return res.status(404).json({
    message: "Route not found",
  });
}

// Parsing, validation और unexpected errors
export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      message: "Invalid JSON. Please check your request body",
    });
  }

  if (error.type === "entity.too.large") {
    return res.status(413).json({
      message: "Request body is too large",
    });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: "Receipt data is invalid",
    });
  }

  console.error("Request failed:", error.name);

  return res.status(500).json({
    message: "Something went wrong on the server",
  });
}
