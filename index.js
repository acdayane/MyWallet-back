import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";
import cashFlowRoutes from "./routes/cashFlowRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(cashFlowRoutes);
app.use(userRoutes);

export let collectionUsers = db.collection("users");
export let collectionEvents = db.collection("events");
export let collectionSessions = db.collection("sessions");

app.listen(process.env.PORT, () => console.log(`App running on port ${process.env.PORT}`));