import express from "express";
import { addEvent, getEvents } from "../controllers/cashFlowController.js";

const router = express.Router();

router.post("/add-event", addEvent);

router.get("/get-events", getEvents);

export default router;