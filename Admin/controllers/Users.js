import Admin from "../models/AdminModel.js";
import Scholar from "../models/ScholarModel.js";
import axios from "axios";
import { con } from "../config/Database.js";
import { Sequelize } from "sequelize";
import Tenant from "../models/TenantModel.js";

export const getAdmin = async (req, res) => {
  try {
    const users = await Admin.findAll();
    res.send(users);
  } catch (err) {
    res.status(400).send(err);
  }
};

export const getAdminbyUsername = async (req, res) => {
  try {
    const users = await Admin.findAll({
      where: {
        username: req.body.username,
      },
    });
    return res.send(users[0]);
  } catch (err) {
    res.status(400).send(err);
  }
};

export const createAdmin = async (req, res) => {
  try {
    const usersExists = await Admin.findOne({
      where: {
        username: req.body.username,
      },
    });
    if (usersExists) {
      return res.status(400).json({ msg: "Username telah terdaftar" });
    } else {
      await Admin.create(req.body);
      res.status(200).json({
        message: "Admin Created",
      });
    }
  } catch (err) {
    res.status(400).send(err);
  }
};

export const updateAdmin = async (req, res) => {
  try {
    await Admin.update(req.body, {
      where: {
        username: req.body.username,
      },
    });
    res.json({
      message: "Admin Updated",
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    await Admin.destroy({
      where: {
        username: req.body.username,
      },
    });
    res.json({
      message: "Admin Deleted",
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

////////// SCHOLAR
export const getScholar = async (req, res) => {
  try {
    const users = await Scholar.findAll({
      include: [
        {
          model: Tenant,
          attributes: [],
          required: false,
          order: ["nama", "asc"],
        },
      ],
      attributes: {
        // exclude: ["tenantId"],
        include: [[Sequelize.literal("tenant.nama"), "tenant"]],
      },
      order: [["alias", "asc"]],
      raw: true,
    });
    res.send(users);
  } catch (err) {
    res.status(400).send(err);
  }
};

export const getScholarByTenant = async (req, res) => {
  try {
    const users = await Scholar.findAll({
      attributes: {
        include: [[Sequelize.literal("tenant.nama"), "tenant"]],
        // exclude: ["tenantId"],
      },
      include: [
        {
          model: Tenant,
          where: {
            nama: req.body.tenant,
          },
          attributes: [],
          // required: false,
        },
      ],
      order: ["alias"],
      raw: true,
    });
    res.send(users);
    console.log(users);
  } catch (err) {
    res.status(400).send(err);
  }
};

export const createScholar = async (req, res) => {
  try {
    const scholarExists = await Scholar.findOne({
      where: {
        alias: req.body.alias,
      },
    });
    if (req.body.addressronin.slice(0, 2) !== "0x") {
      req.body.addressronin = "0x".concat(req.body.addressronin.slice(6));
    }
    if (scholarExists)
      return res.status(400).json({ msg: "Alias telah terdaftar" });
    await Scholar.create(req.body);
    res.json({
      message: "Scholar Created",
    });
    getSLP(req.body.addressronin);
  } catch (err) {
    res.status(400).send(err);
  }
};

export const updateScholar = async (req, res) => {
  try {
    await Scholar.update(req.body, {
      where: {
        id: req.body.id,
      },
    });
    getSLP(req.body.addressronin);
    res.json({
      message: "Scholar Updated",
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

export const deleteScholar = async (req, res) => {
  try {
    await Scholar.destroy({
      where: {
        id: req.body.id,
      },
    });
    res.json({
      message: "Scholar Deleted",
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

const getSLP = async (address) => {
  axios
    .get("https://game-api.axie.technology/api/v1/" + address, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(async function (response) {
      if (response.data.mmr) {
        var mmr = JSON.stringify(response.data.mmr);
        var ingameslp = parseInt(response.data.in_game_slp);
        var last_claim = new Date(response.data.last_claim * 1000)
          .toISOString()
          .slice(0, 10);
        var next_claim = new Date(response.data.next_claim * 1000)
          .toISOString()
          .slice(0, 10);
        var average = Number(
          (
            ingameslp /
            Math.ceil(
              (Math.floor(Date.now() / 1000) - response.data.last_claim) / 86400
            )
          ).toFixed(2)
        );
        await Scholar.update(
          {
            mmr: mmr,
            ingameslp: ingameslp,
            average: average,
            lastclaim: last_claim,
            nextclaim: next_claim,
          },
          {
            where: { addressronin: address },
          }
        );
        const tes = await Scholar.findOne({
          where: {
            addressronin: address,
          },
          include: {
            model: Tenant,
            attributes: [],
          },
          attributes: [
            "average",
            [Sequelize.literal("tenant.low"), "low"],
            [Sequelize.literal("tenant.med"), "med"],
            [Sequelize.literal("tenant.high"), "high"],
          ],
          raw: true,
        });
        var rate = "zero";
        if ((tes.low < tes.average) & (tes.average <= tes.med)) {
          rate = "low";
        } else if ((tes.med < tes.average) & (tes.average <= tes.high)) {
          rate = "medium";
        } else if (tes.average >= tes.high) {
          rate = "high";
        }
        await Scholar.update(
          {
            earningrating: rate,
          },
          {
            where: { addressronin: address },
          }
        );
      } else {
        await Scholar.update(
          {
            mmr: null,
            ingameslp: null,
            average: null,
            lastclaim: null,
            nextclaim: null,
            earningrating: null,
          },
          {
            where: { addressronin: address },
          }
        );
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const isiData = async (req, res) => {
  try {
    const user = await Scholar.findAll();
    var keys = Object.keys(user);
    for (var i = 0; i < keys.length; i++) {
      (function () {
        var j = i;
        setTimeout(function () {
          getSLP(user[j].addressronin);
        }, 1000 * i);
      })();
    }
    setTimeout(function () {
      res.json({ msg: "berhasil" });
    }, 1000 * (keys.length + 1));
  } catch (err) {
    res.status(400).send(err);
  }
};
