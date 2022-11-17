import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import joi from "joi";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);

try {
    await mongoClient.connect();
    console.log("MongoDB connected");
} catch (err) {
    console.log(err)
}

let db = mongoClient.db("API-MyWallet");



app.listen(process.env.PORT, () => console.log(`App running on port ${process.env.PORT}`));