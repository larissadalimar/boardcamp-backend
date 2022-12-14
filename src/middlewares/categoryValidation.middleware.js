import { connectionDB } from "../db/database.js"

export async function categoryValidation(req, res, next){
    
    const { name } = req.body;

    if(!name) return res.status(400);

    try {

        const category  = await connectionDB.query("SELECT name from categories where name=$1;", [name]);

        if(category.rowCount > 0) return res.status(409);
    } catch (error) {
        res.status(500).send(error.message);
    }

    next();
}