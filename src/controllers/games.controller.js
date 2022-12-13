import { connectionDB } from "../db/database.js";

export async function getAll(req, res){

    try {
        const { rows } = await connectionDB.query('SELECT games.id, games.name, image, "stockTotal", "categoryId", "pricePerDay", categories.name as "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id;')
        
        res.send(rows)

    } catch (error) {
        res.status(500).send(error.message)
    }
}

export async function create(req, res){

    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    try {

        await connectionDB.query(`INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") values ($1, $2, $3, $4, $5);`,
        [name, image, stockTotal, categoryId, pricePerDay]);

        res.sendStatus(201);

    } catch (error) {

        res.status(500).send(error.message);
    }
}