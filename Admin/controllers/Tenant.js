import { Sequelize } from "sequelize";
import Tenant from "../models/TenantModel.js";
import { db } from "../config/Database.js";
import Scholar from "../models/ScholarModel.js";
import SLP from "../models/SLPModel.js";
import { Op } from "sequelize";

export const getTenants = async (req, res) => {
  try {
    const tenants = await Tenant.findAll({
      where: {
        [Op.and]: [req.body.nama && { nama: req.body.nama }],
      },
      order: [["nama", "asc"]],
      raw: true,
    });
    res.send(tenants);
  } catch (err) {
    res.status(400).send(err);
  }
};

export const createTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({
      where: { nama: req.body.nama },
    });
    if (tenant) {
      res.status(400).json({ msg: "Udah ada" });
    } else {
      await Tenant.create(req.body);
      res.status(200).json({ msg: "berhasil" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

export const deleteTenant = async (req, res) => {
  try {
    await Tenant.destroy({
      where: {
        nama: req.body.nama,
      },
    });
    res.status(200).json({ msg: "deleted" });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

export const updateTenant = async (req, res) => {
  try {
    await Tenant.update(req.body, {
      where: {
        id: req.body.id,
      },
    });
    res.json({
      message: "Tenant Updated",
    });
  } catch (err) {
    res.status(400).send(err);
  }
};
