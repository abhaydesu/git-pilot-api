export function notFound(req, res) {
  res.status(404).json({ error: "Not found." });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err.type === "entity.too.large") {
    return res.status(413).json({ error: "Request body is too large." });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Request body is not valid JSON." });
  }

  console.error(`Error in ${req.method} ${req.path}:`, err);
  res.status(err.publicStatus || 500).json({
    error: err.publicMessage || "Internal server error.",
  });
}
