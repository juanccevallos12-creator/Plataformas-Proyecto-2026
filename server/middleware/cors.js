export function setupCORS(allowedOrigin) {
  return function (req, res, next) {
    res.header("Access-Control-Allow-Origin", allowedOrigin);
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, x-correlation-id");

    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }

    next();
  };
}
