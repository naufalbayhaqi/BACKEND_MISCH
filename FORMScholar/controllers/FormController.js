const FormModel = require("../models").Form;
const { validationResult } = require('express-validator');

const form = async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(422).json({
            errors: errors.mapped(),
        });
    const payload = req.body;

    try {
        await FormModel.create(payload);
        return res.status(201).json({
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