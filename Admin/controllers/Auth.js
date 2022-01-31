import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
	try {
		const users = await Users.findAll({
			attributes: ["id", "name", "email"],
		});
		res.json(users);
	} catch (error) {
		console.log(error);
	}
};

export const Login = async (req, res) => {
	try {
		const user = await Users.findOne({
			where: {
				username: req.body.username,
			},
		});
		console.log(JSON.stringify(user));
		const match = await bcrypt.compare(req.body.password, user.password);
		if (!match) return res.status(400).json({ msg: "Password salah" });
		const userId = user.id;
		const name = user.name;
		const username = user.username;
		const tenantId = user.tenantId;
		const role = user.role;
		const accessToken = jwt.sign(
			{ userId, name, username, tenantId, role },
			"KONTOL",
			{
				expiresIn: "20s",
			}
		);
		const refreshToken = jwt.sign(
			{ userId, name, username, tenantId, role },
			"MEMEG",
			{
				expiresIn: "1d",
			}
		);
		await Users.update(
			{ refresh_token: refreshToken },
			{
				where: {
					id: userId,
				},
			}
		);
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000,
		});
		res.json({ accessToken });
	} catch (error) {
		res.status(404).json({ msg: "Username tidak ditemukan" });
	}
};

export const Register = async (req, res) => {
	if (req.body.password !== req.body.konfirmasi)
		return res.status(400).json({ msg: "Password tidak cocok" });
	const salt = await bcrypt.genSalt();
	const hashPassword = await bcrypt.hash(req.body.password, salt);
	try {
		await Users.create({
			name: req.body.name,
			username: req.body.username,
			password: hashPassword,
			tenantId: req.body.tenantId,
			role: req.body.role,
		});
		res.json({ msg: "Register Berhasil" });
	} catch (error) {
		// console.log(error);
		res.json(error.message);
	}
};

export const Logout = async (req, res) => {
	const refreshToken = req.cookies.refreshToken;
	if (!refreshToken) return res.sendStatus(204);
	const user = await Users.findAll({
		where: {
			refresh_token: refreshToken,
		},
	});
	if (!user) return res.sendStatus(204);
	const userId = user.id;
	await Users.update(
		{ refresh_token: null },
		{
			where: {
				id: userId,
			},
		}
	);
	res.clearCookie("refreshToken");
	return res.sendStatus(200);
};
