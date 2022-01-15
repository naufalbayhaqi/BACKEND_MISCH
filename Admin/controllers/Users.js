import Admin from "../models/AdminModel.js";
import Scholar from "../models/ScholarModel.js";
import axios from "axios";
import { con } from "../config/Database.js";

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
    console.log(err);
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
    console.log(err);
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
    console.log(err);
  }
};

////////// SCHOLAR
export const getScholar = async (req, res) => {
  try {
    const users = await Scholar.findAll();
    res.send(users);
  } catch (err) {
    console.log(err);
  }
};

export const getScholarbyAlias = async (req, res) => {
  try {
    const users = await Scholar.findAll({
      where: {
        id: req.params.id,
      },
    });
    res.send(users[0]);
  } catch (err) {
    console.log(err);
  }
};

export const createScholar = async (req, res) => {
  try {
    const scholarExists = await Scholar.findOne({
      where: {
        alias: req.body.alias,
      },
    });
    if (scholarExists)
      return res.status(400).json({ msg: "Alias telah terdaftar" });
    await Scholar.create(req.body);
    res.json({
      message: "Scholar Created",
    });
  } catch (err) {
    console.log(err);
  }
};

export const updateScholar = async (req, res) => {
  try {
    await Scholar.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.json({
      message: "Scholar Updated",
    });
  } catch (err) {
    console.log(err);
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
    console.log(err);
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
            // console.log(err);
          }
        );
      } else {
        var sql =
          "UPDATE scholar set mmr=NULL, ingameslp=NULL, average=NULL, lastclaim=NULL, nextclaim=NULL where addressronin=?";
        con.query(sql, [address], function (err, result) {
          console.log(result);
          // console.log(err);
        });
      }
    })
    .catch(function (error) {
      // console.log(error);
      // return res;
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
