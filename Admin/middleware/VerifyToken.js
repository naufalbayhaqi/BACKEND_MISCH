import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.cookies["refreshToken"];
    console.log(authHeader);
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.status(401).send("Invalid Token");
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
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
