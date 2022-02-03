import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
	try {
		const token = req.cookies["x-access-token"];
		if (token == null) return res.status(403).send("Invalid Token");
		jwt.verify(token, "KONTOL", (err, decoded) => {
			if (err) return res.sendStatus(403);
			req.username = decoded.username;
			req.tenantId = decoded.tenantId;
			req.role = decoded.role;
			req.userId = decoded.userId;
			next();
		});
	} catch (err) {
		res.status(403).send("Invalid Token");
	}
};
