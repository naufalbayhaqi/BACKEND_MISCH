import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies["x-access-token"];
    console.log(token);
    if (token == null) return res.status(401).send("Invalid Token");
    jwt.verify(token, "KONTOL", (err, decoded) => {
      console.log(err);
      if (err) return res.sendStatus(403);
      req.username = decoded.username;
      req.tenantId = decoded.tenantId;
      req.role = decoded.role;
      req.userId = decoded.userId;
      next();
    });
  } catch (err) {
    res.status(401).send("Invalid Token");
  }
};
