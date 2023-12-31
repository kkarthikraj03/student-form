import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import pg from "pg";

dotenv.config();
const app = express();
const port = process.env.PORT;



app.use(cors());
app.use(bodyParser.json());

const pool = new pg.Pool({
    user:       process.env.PGUSER,
    host:       process.env.PGHOST,
    database:   process.env.PGDB,
    password:   process.env.PGPASSWORD,
    port:       process.env.PGPORT,
});

const connectDb = async() => {
    try{
        await pool.connect();
        console.log("Database Connected Successfully");
    }
    catch(error){
        console.log("Error in connecting ",error);
    }
}

connectDb();

app.get('/setup',async(req,res) => {
    try{
        await pool.query('CREATE TABLE Students( Id INT PRIMARY KEY, Name VARCHAR(50), Age INT )');
    }
    catch(error){
        console.log("Error is ",error);
        res.sendStatus(500);
    }
})

app.get('/view',async(req,res) => {
    try{
        const result = await pool.query('SELECT * FROM Students');
        res.status(200).send(result.rows);
    }
    catch(error){
        console.log("Error in Getting data", error);
        res.sendStatus(500);
    }
})

app.post('/submit',async(req,res) => {
    const { id,name,age } = req.body;
    try{
        await pool.query("INSERT INTO Students VALUES($1, $2, $3)",[id,name,age]);
        res.status(200).send({ message: "Data Inserted Successfully" });
    }
    catch(error){
        console.error("Error is ",error);
        res.sendStatus(500);
    }
})

app.get('/',(req,res) => {
    res.send("Backend is Working!!!");
})

app.listen(port,() => {
    console.log(`Server is Listening on port ${port}`);
});