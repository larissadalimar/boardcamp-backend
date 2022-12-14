import { connectionDB } from "../db/database.js";
import gameSchema from "../models/game.model.js";

export async function gameValidation(req, res, next){

    const game = req.body;

    const validation = gameSchema.validate(game, {abortEarly: false});

    if(validation.error){
        const errors = validation.error.details.map((e) => e.message);
        return res.status(400).send(errors);
    }

    try {

        const category = await connectionDB.query("SELECT * FROM categories WHERE ID=$1", [game.categoryId]);

        if(category.rowCount < 1 || !game.name) return res.sendStatus(400);

        const gameExist = await connectionDB.query("SELECT * FROM games WHERE name=$1", [game.name]);

        if(gameExist.rowCount > 0) return res.sendStatus(409);

    } catch (error) {

        res.status(500).send(error.message);
    }

    next()
}