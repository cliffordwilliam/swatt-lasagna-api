import express from "express";
import waffleRouter from "./waffles/routers";
import { errorHandler } from "./middlewares/error_handler";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (_req, res) => {
    res.send('I am alive!');
});

app.use("/waffles", waffleRouter);

app.use(errorHandler);

app.listen(PORT, ()=>{
    console.log(`Server running at http://localhost:${PORT}/`);
});

