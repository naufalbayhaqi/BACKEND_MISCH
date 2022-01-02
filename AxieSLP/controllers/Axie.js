import Scholar from "../models/ScholarSLP.js";
import axios from "axios";
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

export const getSLP = async (req, res)=>{
    var options = {
        method: 'GET',
        url: 'https://game-api.axie.technology/api/v1/' + req.params.addressronin,
        headers: {
            "Content-Type": "application/json",
        }
    };
    axios.request(options).then(function (response){
        res.json(response.data)
        var mmr = JSON.stringify(response.data.mmr);
        var ingameslp = parseInt(response.data.in_game_slp);
        var last_claim = parseInt(response.data.last_claim);
        var addressronin = (req.params.addressronin);
        var lastclaim = Number((ingameslp/(Math.ceil((Math.floor(Date.now()/1000)- last_claim)/86400))).toFixed(2));
        var sql = ('UPDATE scholar set mmr=?, ingameslp=?, lastclaim=? where addressronin=?')
        con.query(sql,[mmr,ingameslp,lastclaim,addressronin], function (err, result){
            console.log(result)
        })
    }).catch(function (error) {
        return res
    });
}