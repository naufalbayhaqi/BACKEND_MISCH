import Admin from "../models/AdminModel.js";
import Scholar from "../models/ScholarModel.js";
import axios from "axios";
import { Sequelize } from "sequelize";
import Tenant from "../models/TenantModel.js";
import { Op } from "sequelize";

export const getAdmin = async (req, res) => {
  try {
    const users = await Admin.findAll({
      where: {
        [Op.and]: [req.body.username && { username: req.body.username }],
      },
    });
    res.send(users);
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
      where: {
        [Op.and]: [
          req.body.earningrating && { earningrating: req.body.earningrating },
        ],
      },
      include: [
        {
          model: Tenant,
          attributes: [],
          where: {
            [Op.and]: [
              req.body.tenant && {
                nama: req.body.tenant,
              },
            ],
          },
          // order: ["nama", "asc"],
        },
      ],
      attributes: {
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

// export const getScholarByTenant = async (req, res) => {
//   try {
//     const users = await Scholar.findAll({
//       where: {
//         [Op.and]: [
//           req.body.earningrating && { earningrating: req.body.earningrating },
//         ],
//       },
//       attributes: {
//         include: [[Sequelize.literal("tenant.nama"), "tenant"]],
//       },
//       include: [
//         {
//           model: Tenant,
//           where: {
//             nama: req.body.tenant,
//           },
//           attributes: [],
//         },
//       ],
//       order: [["alias"], ["average"]],
//       raw: true,
//     });
//     res.send(users);
//   } catch (err) {
//     console.log(err);
//     res.status(400).send(err);
//   }
// };

export const createScholar = async (req, res) => {
  try {
    await Scholar.create(req.body, {});
    res.json({
      message: "Scholar Created",
    });
    getSLP(req.body.addressronin);
    // }
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
        if (tes.average == 0) {
          rate = "zero";
        } else if ((tes.low < tes.average) & (tes.average <= tes.med)) {
          rate = "Low";
        } else if ((tes.med < tes.average) & (tes.average <= tes.high)) {
          rate = "Medium";
        } else if (tes.average >= tes.high) {
          rate = "High";
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
