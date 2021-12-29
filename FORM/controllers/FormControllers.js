import FormScholar from "../models/FormScholar.js";
import FormOwner from "../models/FormOwner.js";
import fetch from "node-fetch";

const OwnerSheet = 
"https://v1.nocodeapi.com/titanrukmana/google_sheets/vTxojWwcRbtRfUkk?tabId=Sheet1";

const ScholarSheet = 
"https://v1.nocodeapi.com/titanrukmana/google_sheets/vTxojWwcRbtRfUkk?tabId=Sheet2";

export const formScholar = async (req, res) => {
    try {
        const emailExists = await FormScholar.findAll({
            where:{
                email : req.body.email
            }
        });
        if (emailExists) return res.status(400).json({msg: "Email sudah pernah submit"});
        await FormScholar.create({email: req.body.email});
         await fetch(ScholarSheet, {
             method: "POST",
             headers: {
                 "Content-Type": "application/json",
             },
             body: JSON.stringify([
                [
                 req.body.email,
                 req.body.name,
                 req.body.sosialmedia,
                 req.body.message
                ],
            ]),
        });

    return res.status(201).json(
        {
            status: "Success",
            msg: "Berhasil",
            data: req.body.email,
        });
    } catch (err) {
        console.log(err);
    }
    res.sendStatus(422);
};

//// FORM OWNER

export const formOwner = async (req, res) => {
    try {
        const emailExists = await Admin.findAll({
            where:{
                username : req.body.username
            }
        });
        if (emailExists) return res.status(400).json({msg: "Email sudah pernah submit"});
        await FormOwner.create({email: req.body.email});
         await fetch(OwnerSheet, {
             method: "POST",
             headers: {
                 "Content-Type": "application/json",
             },
             body: JSON.stringify([
                [
                 req.body.email,
                 req.body.name,
                 req.body.domisili,
                 req.body.message
                ],
            ]),
        });

    return res.status(201).json(
        {
            status: "Success",
            msg: "Berhasil",
            data: req.body.email,
        });
    } catch (err) {
        console.log(err);
    }
    res.sendStatus(422);
};