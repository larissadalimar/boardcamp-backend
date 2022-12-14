import { connectionDB } from "../db/database.js";
import dayjs from 'dayjs';

export async function getAll(req, res){

    const { customerId, gameId } = req.query;

    try {

        /* let querySql = `SELECT 
            JSON_BUILD_OBJECT(
              'id', r.id,
              'customerId', r."customerId",
              'gameId', r."gameId",
              'rentDate', r."rentDate",
              'daysRented', r."daysRented",
              'returnDate', r."returnDate", 
              'originalPrice', r."originalPrice",
              'delayFee', r."delayFee",
              'customer', JSON_BUILD_OBJECT(
               'id', c.id,
               'name', c.name
              ),
              'game', JSON_BUILD_OBJECT(
                'id', g.id,
                'name', g.name,
                'categoryId', cat.id,
                'categoryName', cat.name
              )
            )
            FROM rentals r
            JOIN customers c ON "customerId"=c.id
            JOIN games g ON "gameId"=g.id 
            JOIN categories cat ON g."categoryId"=cat.id`; */

        let querySql = `SELECT rentals.*, ROW_TO_JSON (customers.*) AS customer, 
            JSON_BUILD_OBJECT(
                'id',games.id,
                'name',games.name,
                'categoryId',games."categoryId",
                'categoryName',categories.name
                ) AS game FROM rentals
            JOIN customers ON "customerId"=customers.id
            JOIN games ON "gameId"=games.id 
            JOIN categories ON games."categoryId"=categories.id`; 

        if(customerId){
            querySql += ` WHERE "customerId"=${customerId}`;
            if(gameId) querySql += ` AND "gameId"=${gameId}`;
        }else if(gameId) querySql += ` WHERE "gameId"=${gameId}`;

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
            "customerId",
            "gameId",
            "rentDate",
            "daysRented",
            "returnDate",          
            "originalPrice",
            "delayFee"
          ) VALUES ($1, $2, $3, $4, null, $5, null)`,
        [customerId, gameId, dayjs().format("YYYY-MM-DD"), daysRented, gamePricePerDay*daysRented]);

        res.sendStatus(201);

    } catch (error) {
     
        res.status(500).send(error.message);
    }
}

export async function returnRental(req, res){
    const  id  = req.params.id;

    try {

        const { rows } = await connectionDB.query("SELECT * FROM rentals WHERE id=$1", [id]);

        const game =  await connectionDB.query("SELECT * FROM games WHERE id=$1;", [rows[0].gameId]);

        await connectionDB.query(`UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3;`, 
        [dayjs().format("YYYY-MM-DD"), dayjs().diff(dayjs(rows[0].rentDate).add(rows[0].daysRented, 'day'), 'day')*game.rows[0].pricePerDay, id]);

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