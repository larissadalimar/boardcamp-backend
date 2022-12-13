import { connectionDB } from "../db/database.js";

export async function gameValidation(req, res, next){

    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    try {

        const category = await connectionDB.query("SELECT * FROM categories WHERE ID=$1", [categoryId]);

        if(category.rowCount < 1 || !name || stockTotal <= 0 || pricePerDay <= 0) return res.sendStatus(400);

        const game = await connectionDB.query("SELECT * FROM games WHERE name=$1", [name]);

        if(game.rows.lenght > 0) return res.sendStatus(409);

    } catch (error) {

        res.status(500).send(error.message);
    }

    next()
}