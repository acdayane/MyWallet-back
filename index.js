import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { signUp, signIn } from './controllers/usersController.js';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

app.post("/sign-up", signUp);

app.post("/sign-in", signIn);

app.listen(process.env.PORT, () => console.log(`App running on port ${process.env.PORT}`));