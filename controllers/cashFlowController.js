import joi from "joi";
import { collectionEvents, collectionSessions } from "../index.js";

const eventSchema = joi.object({
    description: joi.string().required().min(3).max(30),
    value: joi.number().required()
});

export async function addEvent(req, res) {
    const { description, value } = req.body;
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    const date = new Date();
    const currentDate = date.getDate() + "/" + (date.getMonth() + 1);
   
    if (!token) {
        return res.sendStatus(401);
    };

    try {
        const validation = eventSchema.validate({ description, value }, { abortEarly: false });

        if (validation.error) {
            const err = validation.error.details.map((d) => d.message);
            return res.status(422).send(err);
        };

        const session = await collectionSessions.findOne({ token });
        
        if (!session) {
            return res.sendStatus(401);
        }

        const newEvent = ({
            date: currentDate,
            description: description,
            value: value
        });

        await collectionEvents.insertOne({user: session.userId, newEvent});

        res.status(201).send("Evento criado!");

    } catch (err) {
        res.status(500).send(err);
    }
};

export async function getEvents(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) {
        return res.sendStatus(401);
    };

    try {
        const sessionOpened = await collectionSessions.findOne({ token });

        if (!sessionOpened) {
            return res.status(401).send("É necessário iniciar uma nova sessão");
        };
      
        const events = await collectionEvents.find({user: sessionOpened.userId}).toArray();

        res.status(200).send(events);

    } catch (err) {
        res.status(500).send(err);
    };
};
