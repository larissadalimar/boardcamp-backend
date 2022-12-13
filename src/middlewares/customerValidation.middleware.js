import { connectionDB } from "../db/database.js";
import customerSchema from "../models/customer.model.js"

export default async function customerValidation(req, res, next){

    const user = req.body;
    const id = req.params.id;

    const validation = customerSchema.validate(user, {abortEarly: false});

    if(validation.error){
        const errors = validation.error.details.map((e) => e.message);
        return res.status(400).send(errors);
    }

    try {

        if(id) {
            const client = await connectionDB.query("SELECT * FROM customers WHERE id=$1;", [id]);

            if(client.rowCount < 1) return res.sendStatus(404);
        }else{
            const customer = await connectionDB.query("SELECT * FROM customers WHERE cpf=$1;", [user.cpf]);

            if(customer.rowCount > 0) return res.status(409).send("Já existe outro usuário cadastrado com este cpf");
        }
        
    } catch (error) {

        return res.status(500).send(error.message);

    }

    next();
}