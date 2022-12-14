import { connectionDB } from "../db/database.js"
import categorySchema from "../models/category.model.js";

export async function categoryValidation(req, res, next){
    
    const { name } = req.body;

    if(!name) return res.status(400);

    const validation = categorySchema.validate({name}, {abortEarly: false});

    if(validation.error){
        const errors = validation.error.details.map((e) => e.message);
        return res.status(400).send(errors);
    }

    try {

        const categoryExist  = await connectionDB.query("SELECT * FROM categories WHERE name=$1;", [name]);

        if(categoryExist.rowCount > 0) return res.sendStatus(409);

    } catch (error) {
        res.status(500).send(error.message);
    }

    next();
}