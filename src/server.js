import express from 'express';
import cors from 'cors';
import categoriesRoutes from './routes/categories.routes';
import gamesRoutes from './routes/games.routes';

config.use(dot)
const app = express()

app.use(cors())
app.use(express.json())

app.use(categoriesRoutes);
app.use(gamesRoutes)

app.listen(4000, console.log("Running in port 4000"))