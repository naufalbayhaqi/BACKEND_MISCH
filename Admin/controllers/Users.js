import Admin from "../models/AdminModel.js";
import Scholar from "../models/ScholarModel.js";
 
export const getAdmin = async (req, res) => {
    try {
        const users = await Admin.findAll();
        res.send(users);
    } catch (err) {
        res.status(400).send(err)
    }
}
 
export const getAdminbyUsername = async (req, res) => {
    try {
        const users = await Admin.findAll({
            where: {
                username: req.params.username
            }
        });
        return res.send(users[0]);
    } catch (err) {
        res.status(400).send(err)
    }
}

export const createAdmin = async (req, res) => {
    try {
        const usersExists = await Admin.findOne({
            where:{
                username : req.body.username
            }
        });
        if (usersExists) return res.status(400).json({msg: "Username telah terdaftar"});
        await Admin.create(req.body);
        res.json({
            "message" : "Admin Created"
        });
    } catch (err) {
        console.log(err);
    }
}
 
export const updateAdmin = async (req, res) => {
    try {
        await Admin.update(req.body, {
            where: {
                username: req.params.username
            }
        });
        res.json({
            "message": "Admin Updated"
        });
    } catch (err) {
        console.log(err);
    }
}
 
export const deleteAdmin = async (req, res) => {
    try {
        await Admin.destroy({
            where: {
                username: req.params.username
            }
        });
        res.json({
            "message": "Admin Deleted"
        });
    } catch (err) {
        console.log(err);
    }
}

////////// SCHOLAR
export const getScholar = async (req, res) => {
    try {
        const users = await Scholar.findAll();
        res.send(users);
    } catch (err) {
        console.log(err);
    }
}
 
export const getScholarbyAlias = async (req, res) => {
    try {
        const users = await Scholar.findAll({
            where: {
                id: req.params.id
            }
        });
        res.send(users[0]);
    } catch (err) {
        console.log(err);
    }
}
 
export const createScholar = async (req, res) => {
    try {
        const scholarExists = await Scholar.findOne({
            where:{
                alias : req.body.alias
            }
        });
        if (scholarExists) return res.status(400).json({msg: "Alias telah terdaftar"});
        await Scholar.create(req.body);
        res.json({
            "message" : "Scholar Created"
        });
    } catch (err) {
        console.log(err);
    }
}
 
export const updateScholar = async (req, res) => {
    try {
        await Scholar.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        res.json({
            "message": "Scholar Updated"
        });
    } catch (err) {
        console.log(err);
    }
}
 
export const deleteScholar = async (req, res) => {
    try {
        await Scholar.destroy({
            where: {
                id: req.params.id
            }
        });
        res.json({
            "message": "Scholar Deleted"
        });
    } catch (err) {
        console.log(err);
    }
}