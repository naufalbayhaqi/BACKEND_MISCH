import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Tenant from "../models/TenantModel.js";
import axios from "axios";
import { Sequelize } from "sequelize";
import randomWords from "random-words";
import { Op } from "sequelize";

export const getUsers = async (req, res) => {
	try {
		const users = await Users.findAll({
			where: {
				[Op.and]: [req.body.username && { username: req.body.username }],
			},
			attributes: [
				"id",
				"name",
				"role",
				"email",
				"nowa",
				"username",
				"tenantId",
			],
		});
		res.send(users);
	} catch (error) {
		res.status(400).send(error);
		console.log(error);
	}
};

export const getProfile = async (req, res) => {
	try {
		const users = await Users.findOne({
			where: {
				username: req.body.username,
			},
			include: {
				model: Tenant,
				attributes: [],
			},
			attributes: [
				"id",
				"name",
				"role",
				"email",
				"nowa",
				"tenantId",
				"username",
				[Sequelize.literal("tenant.nama"), "tenant"],
			],
			raw: true,
		});
		console.log(users);
		res.send(users);
	} catch (error) {
		res.status(400).send(error);
		console.log(error);
	}
};

export const createUser = async (req, res) => {
	try {
		const usersExists = await Users.findOne({
			where: {
				username: req.body.username,
			},
		});
		if (usersExists) {
			return res.status(400).json({ msg: "Username telah terdaftar" });
		} else {
			const salt = await bcrypt.genSalt();
			const token =
				"HyTvdRKmXP4SwRayQnlmH8sDYXmdb72Tb8Mh8aTdGmytwOy5xOXNS9Uzgps8fQ7C";
			const number = req.body.nowa;
			const password = randomWords({
				exactly: 2,
				join: "_",
				formatter: (word, index) => {
					return index === 0
						? word.slice(0, 1).toUpperCase().concat(word.slice(1))
						: word;
				},
			});
			const message = `Selamat, ${req.body.name}! Anda telah terdaftar pada MISCH.gg dengan:
Username: ${req.body.username}
Password: ${password}
Silakan segera login dan lakukan perubahan password.`;
			const hashPassword = await bcrypt.hash(password, salt);
			await Users.create({
				name: req.body.name,
				username: req.body.username,
				password: hashPassword,
				tenantId: req.body.tenantId,
				nowa: req.body.nowa,
				email: req.body.email,
				role: req.body.role,
			}).then(function () {
				axios
					.get(
						`https://teras.wablas.com/api/send-message?token=${token}&phone=${number}&message=${message}`
					)
					.then((res) => {
						console.log(res);
					})
					.catch((err) => {
						console.log(err);
					});
			});
			res.json({ msg: "Register Berhasil" });
		}
	} catch (err) {
		res.status(400).send(err);
	}
};

export const updateUser = async (req, res) => {
	try {
		const id = req.body.id;
		const nama = req.body.nama;
		const nowa = req.body.nowa;
		const email = req.body.email;
		console.log(req.body);
		if (req.body.password) {
			const salt = await bcrypt.genSalt();
			const hashPassword = await bcrypt.hash(req.body.password, salt);
			await Users.update(
				{
					id: id,
					nama: nama,
					nowa: nowa,
					email: email,
					password: hashPassword,
				},
				{
					where: {
						id: req.body.id,
					},
				}
			);
			res.json({
				message: "User Updated",
			});
		} else {
			await Users.update({
				where: {
					id: req.body.id,
				},
			});
			res.json({
				message: "User Updated",
			});
		}
	} catch (err) {
		res.status(400).send(err);
		console.log(err);
	}
};

export const deleteUser = async (req, res) => {
	try {
		await Users.destroy({
			where: {
				username: req.body.username,
			},
		});
		res.json({
			message: "User Deleted",
		});
	} catch (err) {
		res.status(400).send(err);
	}
};

export const Login = async (req, res) => {
	try {
		const user = await Users.findOne({
			where: {
				username: req.body.username,
			},
			include: {
				model: Tenant,
			},
		});
		// console.log(JSON.stringify(user));
		const match = await bcrypt.compare(req.body.password, user.password);
		if (match) {
			const userId = user.id;
			const name = user.name;
			const username = user.username;
			const tenant = user.tenant.nama;
			const role = user.role;
			const accessToken = jwt.sign(
				{ userId, username, tenant, role },
				"KONTOL",
				{
					expiresIn: "20s",
				}
			);
			const refreshToken = jwt.sign(
				{ userId, username, tenant, role },
				"MEMEK",
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
				// httpOnly: true,
				maxAge: 24 * 60 * 60 * 1000,
				secure: false,
			});
			res.cookie("x-access-token", accessToken, {
				// httpOnly: true,
			});
			//   res.header("Access-Control-Allow-Origin", "*");
			res.header(
				"Access-Control-Allow-Headers",
				"Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization"
			);
			res.header("Access-Control-Allow-Methods", "GET, POST, PUT ,DELETE");
			res.header("Access-Control-Allow-Credentials", true);
			res
				.status(200)
				.send({ accessToken, userId, username, tenant, name, role });
		} else {
			res.status(401).send(err);
		}
	} catch (err) {
		console.log(err);
		res.status(400).send(err);
	}
};

// export const Register = async (req, res) => {
// 	try {
// 		if (req.body.password !== req.body.konfirmasi)
// 			return res.status(400).json({ msg: "Password tidak cocok" });
// 		const salt = await bcrypt.genSalt();
// 		const hashPassword = await bcrypt.hash(req.body.password, salt);
// 		await Users.create({
// 			name: req.body.name,
// 			username: req.body.username,
// 			password: hashPassword,
// 			tenantId: req.body.tenantId,
// 			role: req.body.role,
// 		});
// 		res.json({ msg: "Register Berhasil" });
// 	} catch (error) {
// 		// console.log(error);
// 		res.json(error.message);
// 	}
// };

export const Logout = async (req, res) => {
	try {
		const refreshToken = req.cookies["refreshToken"];
		if (!refreshToken) return res.sendStatus(204);
		const user = await Users.findAll({
			where: {
				refresh_token: refreshToken,
			},
		});
		if (!user[0]) {
			return res.sendStatus(204);
		} else {
			const userId = user[0].id;
			// console.log(userId);
			await Users.update(
				{ refresh_token: null },
				{
					where: {
						id: userId,
					},
				}
			);
			res.clearCookie("refreshToken");
			res.clearCookie("x-access-token");
			return res.sendStatus(200);
		}
	} catch (err) {
		res.status(400);
	}
};

export const forgotPassowrd = async (req, res) => {
	try {
		const salt = await bcrypt.genSalt();
		const token =
			"HyTvdRKmXP4SwRayQnlmH8sDYXmdb72Tb8Mh8aTdGmytwOy5xOXNS9Uzgps8fQ7C";
		const number = req.body.nowa;
		const password = randomWords({
			exactly: 2,
			join: "_",
			formatter: (word, index) => {
				return index === 0
					? word.slice(0, 1).toUpperCase().concat(word.slice(1))
					: word;
			},
		});
		const hashPassword = await bcrypt.hash(password, salt);
		const user = await Users.findOne({
			where: {
				nowa: req.body.nowa,
			},
		});
		const message = `Kamu pasti lupa password ya, ${user.name}. Nih:
Username: ${user.username}
Password: ${password}
Silakan segera login dan lakukan perubahan password.`;
		await Users.update(
			{ password: hashPassword },
			{
				where: {
					nowa: req.body.nowa,
				},
			}
		).then(function () {
			axios
				.get(
					`https://teras.wablas.com/api/send-message?token=${token}&phone=${number}&message=${message}`
				)
				.then((res) => {
					console.log(res);
				})
				.catch((err) => {
					console.log(err);
				});
		});
		res.status(200).send("TES");
	} catch (err) {
		res.status(400).send(err);
	}
};
