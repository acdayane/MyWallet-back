import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";

import { signUp, signIn } from './controllers/usersController.js';
import { addEvent, getEvents } from "./controllers/cashFlowController.js";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

export let collectionUsers = db.collection("users");
export let collectionEvents = db.collection("events");
export let collectionSessions = db.collection("sessions");

app.post("/sign-up", signUp);

app.post("/sign-in", signIn);

app.post("/add-event", addEvent);

app.get("/get-events", getEvents);

app.listen(process.env.PORT, () => console.log(`App running on port ${process.env.PORT}`));