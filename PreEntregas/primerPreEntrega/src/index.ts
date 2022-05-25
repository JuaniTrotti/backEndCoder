import express from "express";
import { getTime } from "./lib/date";

const app = express();

app.get('/', (req, res) => {
    res.send({
        time: getTime(),
        name: 'PreEntrega 1',
        header: 'De a poco se complica'
    });
})

const PORT:number = 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
