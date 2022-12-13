import { connectionDB } from "../db/database.js";

export async function getAll(req, res){

    const { customerId, gameId } = req.query;

    try {

        let querySql = `SELECT * FROM rentals join customer ON rentals."customerId"= customers.id join rentals."gameId"=games.id`;

        if(customerId){
            querySql += ` WHERE "customerId=${customerId}`;
            if(gameId) querySql += ` AND `;
        } 

        if(gameId) querySql += `WHERE "gameId"=${gameId}`;

        const { rows } = await connectionDB.query(querySql + `;`);

        res.send(rows);

    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function create(req, res){

    const { customerId, gameId, daysRented } = req.body;

    try {

        const { rows } = await connectionDB.query("SELECT * FROM games WHERE id=$1", [gameId]);

        const gamePricePerDay = rows[0].pricePerDay;
        
        await connectionDB.query(`INSERT INTO rentals (
            customerId,
            gameId,
            rentDate,
            daysRented,
            returnDate,          
            originalPrice,
            delayFee
          ) VALUES ($1, $2, $3, $4, null, $5, null)`,
        [customerId, gameId, dayjs().format('DD-MM-YYYY'), daysRented, gamePricePerDay*daysRented]);

        res.sendStatus(201);

    } catch (error) {
     
        res.status(500).send(error.message);
    }
}

export async function returnRental(req, res){
    const { id } = req.params;

    try {

        const { rows } = await connectionDB.query("SELECT * FROM rentals WHERE id=$1;", [id]);

        const game =  await connectionDB.query("SELECT * FROM games WHERE id=$1;", [rows[0].gameId]);

        await connectionDB.query(`UPDATE rentals SET "returnDate"=$1 "delayFee"=$2 WHERE id=$3;`, 
        [dayjs().format('DD-MM-YYYY'), dayjs().diff(dayjs(rows[0].rentDate).add(rows[0].daysRented, 'day'))*game.rows[0].pricePerDay, id]);

        //dayjs().diff(rows[0].rentDate, 'day') - rows[0].daysRented
       //dayjs().diff(dayjs(rows[0].rentDate).add(rows[0].daysRented, 'day'))

       res.sendStatus(200);
    } catch (error) {
        
        res.status(500).send(error.message);
    }
}

export async function deleteRental(req, res){

    const { id } = req.params;

    try {

        await connectionDB.query("DELETE FROM rentals WHERE id=$1;", [id]);

        res.sendStatus(200);
        
    } catch (error) {
        
        res.status(500).send(error.message);
    }
}