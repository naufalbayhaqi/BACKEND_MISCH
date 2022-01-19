import Admin from "../models/AdminModel.js";
import Scholar from "../models/ScholarModel.js";
import axios from "axios";
import { con } from "../config/Database.js";
import { Sequelize } from "sequelize";

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
        username: req.params.username,
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
    if (usersExists)
      return res.status(400).json({ msg: "Username telah terdaftar" });
    await Admin.create(req.body);
    res.json({
      message: "Admin Created",
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

export const updateAdmin = async (req, res) => {
  try {
    await Admin.update(req.body, {
      where: {
        username: req.params.username,
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
        username: req.params.username,
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
      order: [
        ["tenant", "asc"],
        ["alias", "asc"],
      ],
    });
    res.send(users);
  } catch (err) {
    res.status(400).send(err);
  }
};

export const getScholarByTenant = async (req, res) => {
  try {
    const users = await Scholar.findAll({
      where: {
        tenant: req.params.tenant,
      },
      order: ["alias"],
    });
    res.send(users);
  } catch (err) {
    res.status(400).send(err);
  }
};

export const getTenants = async (req, res) => {
  try {
    const tenants = await Scholar.findAll({
      attributes: [[Sequelize.literal("DISTINCT `tenant`"), "tenant"]],
    });
    res.send(tenants);
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
    if (scholarExists) {
      return res.status(400).json({ msg: "Alias telah terdaftar" });
    }
    if (!req.body.tenant) {
      req.body.tenant = "Misch";
    }
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
        id: req.params.id,
      },
    });
    getSLP(req.body.addressronin);
    res.json({
      message: "Scholar Updated",
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

export const deleteScholar = async (req, res) => {
  try {
    await Scholar.destroy({
      where: {
        id: req.params.id,
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
    .then(function (response) {
      if (response.data.mmr) {
        var mmr = JSON.stringify(response.data.mmr);
        var ingameslp = parseInt(response.data.in_game_slp);
        var last_claim = new Date(response.data.last_claim * 1000)
          .toISOString()
          .slice(0, 10);
        var addressronin = address;
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
        var sql =
          "UPDATE scholar set mmr=?, ingameslp=?, average=?, lastclaim=?, nextclaim=? where addressronin=?";
        con.query(
          sql,
          [mmr, ingameslp, average, last_claim, next_claim, addressronin],
          function (err, result) {
            console.log(result);
            console.log(err);
          }
        );
      } else {
        var sql =
          "UPDATE scholar set mmr=NULL, ingameslp=NULL, average=NULL, lastclaim=NULL, nextclaim=NULL where addressronin=?";
        con.query(sql, [address], function (err, result) {
          console.log(result);
          console.log(err);
        });
      }
    })
    .catch(function (error) {
      res.status(400).send(error);
    });
};

export async function isiData() {
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
}
