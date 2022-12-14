import { connectionDB } from "../db/database.js";
import rentalSchema from "../models/rental.models.js";

export default async function rentalValidation(req, res, next){

    const { customerId, gameId, daysRented} = req.body;

    const validation = rentalSchema.validate({customerId, gameId, daysRented}, {abortEarly: false});

    if(validation.error) return res.status(400).send(validation.error.details.map(e => e.message));

    try {

        const customer = await connectionDB.query("SELECT * FROM customers WHERE id=$1;", [customerId]);

        const game = await connectionDB.query("SELECT * FROM games WHERE id=$1;", [gameId]);

        if(game.rows.length === 0 || customer.rows.length === 0) return res.status(400).send("Este usuário e/ou jogo não existe");

        const gameRentals = await connectionDB.query(`SELECT * FROM rentals WHERE "gameId"=$1;`, [gameId]);

        if(gameRentals.rows.length >= game.rows[0].stockTotal) return res.status(400).send("Não temos esse jogo em estoque no momento. Volte mais tarde.");
         
    } catch (error) {
        res.status(500).send(error.message);
    }

    next();
}