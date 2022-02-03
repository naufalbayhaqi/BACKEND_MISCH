import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
	try {
		const refreshToken = req.cookies["refreshToken"];
		if (!refreshToken) return res.status(401).send("gagal1");
		const user = await Users.findOne({
			where: {
				refresh_token: refreshToken,
			},
		});
		if (!user) {
			res.clearCookie("refreshToken");
			res.clearCookie("x-access-token");
			return res.status(401).send("gagal2");
		}
		jwt.verify(refreshToken, "MEMEK", (err, decoded) => {
			if (err) return res.status(401).send("gagal3");
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
		res.clearCookie("refreshToken");
		res.status(403);
	}
};
