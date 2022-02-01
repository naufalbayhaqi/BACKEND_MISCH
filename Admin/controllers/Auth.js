import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Tenant from "../models/TenantModel.js";

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ["id", "name"],
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
      include: {
        model: Tenant,
        attributes: ["nama"],
      },
    });
    console.log(JSON.stringify(user));
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
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: false,
      });
      res.cookie("x-access-token", accessToken, {
        httpOnly: true,
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

export const Register = async (req, res) => {
  try {
    if (req.body.password !== req.body.konfirmasi)
      return res.status(400).json({ msg: "Password tidak cocok" });
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(req.body.password, salt);
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
  try {
    const refreshToken = req.cookies["refreshToken"];
    if (!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    console.log(user[0]);
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
