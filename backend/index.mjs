import express from "express";
import cors from "cors";

import jadwalRoutes from "./routes/jadwal-router.mjs"
import BarRouter from "./routes/barbershop-router.mjs";
import UsersRouter from "./routes/users-router.mjs";
import KapsRouter from "./routes/barbers-router.mjs";
import ServRouter from "./routes/services-router.mjs";
import Book from "./routes/bookings-router.mjs";

const app = express()
const port = 4000

app.use(express.json());
app.use(cors());

app.use(express.static('public'));
app.use('/api/jadwal', jadwalRoutes);
app.use('/api/barbershop', BarRouter);
app.use('/api/users', UsersRouter);
app.use('/api/barbers', KapsRouter);
app.use('/api/serv', ServRouter);
app.use('/api/book', Book);

// app.get('/', (req, res) => {
//     res.send('YOWW SHH!TT!')
// })

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})
