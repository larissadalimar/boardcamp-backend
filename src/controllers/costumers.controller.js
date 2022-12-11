import { connectionDB } from "../db/database";

export async function getAll(req, res){

    const { cpf } = req.query

    try {

        let costumers = []

        if(cpf) costumers = await connectionDB.query("SELECT * FROM costumers WHERE cpf LIKE '$1%';", [cpf])
        else costumers = await connectionDB.query("SELECT * FROM costumers;")

        res.send(costumers.rows)

    } catch (error) {
        res.status(500).send(error.message)
    }
}

export async function find(req, res){
    const id = req.id

    try {
        const { rows } = await connectionDB.query("SELECT * FROM costumers WHERE id=$1;", [id])

        if(rows.length === 0) return res.sendStatus(404)

        return res.send(rows)
        
    } catch (error) {
        
        res.status(500).send(error.message)
    }
}

export async function create(req, res){

    const { name, phone, cpf, birthday } = req.body

    try {
        
        await connectionDB.query("INSERT INTO costumers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);" [name, phone, cpf, birthday])

        res.sendStatus(201)

    } catch (error) {
        res.status(500).send(error.message)
    }
}