import { connectionDB } from "../db/database.js";

export default async function deleteRentalValidation(req, res, next){
    const { id } = req.params;

    try {
        
        const { rows } = await connectionDB.query("SELECT * FROM rentals WHERE id=$1;", [id]);

        if(rows.length === 0) return res.sendStatus(404);

        if(rows[0].returnDate === null) return res.sendStatus(400);

    } catch (error) {

        res.status(500).send(error.message);
        
    }

    next();
}