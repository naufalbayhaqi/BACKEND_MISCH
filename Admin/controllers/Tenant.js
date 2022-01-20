import { Sequelize } from "sequelize";
import Tenant from "../models/TenantModel.js";
import { db } from "../config/Database.js";
import Scholar from "../models/ScholarModel.js";

export const getTenants = async (req, res) => {
  try {
    const tenants = await Tenant.findAll();
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
    db.transaction(async function (t) {
      return Tenant.destroy({
        where: {
          nama: req.body.nama,
        },
      }).then(function () {
        return Scholar.destroy({
          where: {
            tenant: req.body.nama,
          },
        });
      });
    });
    res.status(200).json({ msg: "deleted" });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};
