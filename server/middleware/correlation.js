export function correlation(req, res, next) {
  const incoming = req.headers["x-correlation-id"];

  const cid =
    incoming ||
    "cid-" + Math.random().toString(36).substring(2, 10);

  req.correlationId = cid;
  res.setHeader("x-correlation-id", cid);

  next();
}
