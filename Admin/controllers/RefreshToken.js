import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
	try {
		const refreshToken = req.cookies["refreshToken"];
		if (!refreshToken) return res.sendStatus(401);
		const user = await Users.findOne({
			where: {
				refresh_token: refreshToken,
			},
		});
		if (!user) return res.sendStatus(401);
		jwt.verify(refreshToken, "MEMEK", (err, decoded) => {
			if (err) return res.sendStatus(401);
			const userId = user.id;
			const name = user.name;
			const username = user.username;
			const accessToken = jwt.sign({ userId, name, username }, "KONTOL", {
				expiresIn: "15s",
			});
			res.cookie("x-access-token", accessToken, {
				httpOnly: true,
				overwrite: true,
			});
			res.json({ accessToken });
		});
	} catch (error) {
		res.status(403);
		console.log(error);
	}
};
