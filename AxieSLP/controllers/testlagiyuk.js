import Scholar from "../models/ScholarSLP.js";
import fetch from "node-fetch";

const URLSLP =
"https://game-api.axie.technology/api/v1/";

export const ambiladdress = async(req, res) => {
    try{
        const user = await Scholar.findAll({
            attributes: ['addressronin'],
            where: {
            alias : req.body.alias
        }
    });
    await console.log( JSON.stringify(user));
 } catch (err) {
     console.log(err);
 }
}