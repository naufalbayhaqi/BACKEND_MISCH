import Scholar from "../models/ScholarSLP.js";
import axios from "axios";
import db from "../config/Database.js";
import con from "../config/DatabaseBukanSequelize.js";

export const ambiladdress = async(req, res) => {
  try{
      const user = await Scholar.findAll({
          attributes: ['addressronin'],
          where: {
          alias : req.body.alias
      }
  });
  await console.log(JSON.stringify(user));
} catch (err) {
   console.log(err);
}
}

const url = 'https://game-api.axie.technology/api/v1/'

export const slpaxie = async(req, res) =>{
    try {
        const roninada = await Scholar.findAll({
            where:{
                addressronin : req.params.addressronin
            }
        });
        await fetch(url + req.params.addressronin,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        
    }
}