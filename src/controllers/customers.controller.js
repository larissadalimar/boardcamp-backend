import { connectionDB } from "../db/database.js";

export async function getAll(req, res){

    const { cpf } = req.query

    try {

        let customers = []

        if(cpf) customers = await connectionDB.query("SELECT * FROM customers WHERE cpf LIKE $1;", [`${cpf}%`])
        else customers = await connectionDB.query("SELECT * FROM customers;")

        res.send(customers.rows)

    } catch (error) {
        res.status(500).send(error.message)
    }
}

export async function find(req, res){

    const id = req.params.id

    try {
        const customer = await connectionDB.query("SELECT * FROM customers WHERE id=$1;", [id])

        if(customer.rowCount === 0) return res.sendStatus(404)

        return res.send(customer.rows)
        
    } catch (error) {
        
        res.status(500).send(error.message);
    }
}

export async function create(req, res){

    const { name, phone, cpf, birthday } = req.body;

    try {
        
        await connectionDB.query("INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);", [name, phone, cpf, birthday]);

        res.sendStatus(201);

    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function update(req, res){

    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;

    try {

        await connectionDB.query("UPDATE customers SET name=$2,  phone=$3, cpf=$4, birthday=$5 WHERE id=$1;", 
        [id, name, phone, cpf, birthday]);
        
        res.sendStatus(200);

    } catch (error) {
        
        res.status(500).send(error.message);
    }
}