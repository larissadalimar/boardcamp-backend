import { connectionDB } from "../db/database"

export async function categoryValidation(req, res, next){
    
    const { name } = req.body

    if(!name) return res.status(400)

    try {
        const { rows } = await connectionDB.query("SELECT name from categories where name=$1;", [name])

        if(rows === name) return res.status(409)

    } catch (error) {
        console.log(error)
    }

    next()
}