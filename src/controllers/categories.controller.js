import { connectionDB } from "../db/database.js";

export async function getAll(req, res){

    try {

       const { rows } = await connectionDB.query("SELECT * FROM categories;")

       res.send(rows);

    } catch (error) {
        
        res.status(500).send(error.message);
    }
}

export async function create(req, res){

    const { name } = req.body;

    try {

        await connectionDB.query("INSERT INTO categories(name) VALUES ($1);", [name]);

        res.sendStatus(201);

    } catch (error) {
        res.status(500).send(error.message)
    }
}