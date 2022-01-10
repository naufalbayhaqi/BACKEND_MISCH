const fetch = require('cross-fetch');
const FormModel = require("../models").Form;
const { validationResult } = require("express-validator");

const Sheet =
  "https://v1.nocodeapi.com/titanrukmana/google_sheets/vTxojWwcRbtRfUkk?tabId=Sheet1";

const form = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({
      errors: errors.mapped(),
    });
  const payload = req.body;

  try {
    await FormModel.create(payload);
      await fetch(Sheet, {
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
        data: payload,
      });
  } catch (err) {
    console.log(err);
  }
  res.sendStatus(422);
};

module.exports = { form };