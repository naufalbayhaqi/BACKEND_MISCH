const express = require('express')
const router = express.Router()
const { check } = require('express-validator');
const FormModel = require("../models").Form;
const { form } = require("../controllers/FormController");
const fetch = require("node-fetch");

router.post(
    '/form',
    check("email").isLength({ min: 1 }),
    check("email").custom((value) => {
        return FormModel.findOne({ where: { email: value } }).then((user) => {
            if (user) {
                return Promise.reject('LU UDAH REQUEST SCHOLARSHIP YA, JANGAN SPAM KONTOL');
            }
        });
    }),
    form
);

module.exports = router;