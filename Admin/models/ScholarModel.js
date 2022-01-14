import { Sequelize } from "sequelize";
import { db } from "../config/Database.js";

const { DataTypes } = Sequelize;

const Scholar = db.define(
  "scholar",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    nama: {
      type: DataTypes.STRING,
    },
    tenant: {
      type: DataTypes.STRING,
    },
    alias: {
      type: DataTypes.STRING,
    },
    tgllahir: {
      type: DataTypes.DATE,
    },
    gender: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    nowa: {
      type: DataTypes.STRING,
    },
    earningrating: {
      type: DataTypes.STRING,
    },
    addressronin: {
      type: DataTypes.STRING,
    },
    scholarpshare: {
      type: DataTypes.NUMBER,
    },
    ownerpshare: {
      type: DataTypes.NUMBER,
    },
    managerpshare: {
      type: DataTypes.NUMBER,
    },
    mmr: {
      type: DataTypes.NUMBER,
    },
    ingameslp: {
      type: DataTypes.NUMBER,
    },
    lastclaim: {
      type: DataTypes.NUMBER,
    },
    nextclaim: {
      type: DataTypes.DATE,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Scholar;
