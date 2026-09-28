/**
 * Validates req.body against a schema of `{ field: { required, maxLength } }`.
 * All fields are strings. Responds 400 instead of letting handlers crash.
 */
export function validateBody(schema) {
  return (req, res, next) => {
    const body = req.body;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res
        .status(400)
        .json({ error: "Request body must be a JSON object." });
    }

    for (const [field, { required = false, maxLength }] of Object.entries(
      schema
    )) {
      const value = body[field];

      if (value === undefined || value === null || value === "") {
        if (required)
          return res.status(400).json({ error: `"${field}" is required.` });
        continue;
      }
      if (typeof value !== "string") {
        return res.status(400).json({ error: `"${field}" must be a string.` });
      }
      if (required && value.trim() === "") {
        return res.status(400).json({ error: `"${field}" is required.` });
      }
      if (maxLength && value.length > maxLength) {
        return res.status(400).json({
          error: `"${field}" must be at most ${maxLength} characters.`,
        });
      }
    }

    next();
  };
}
