import joi from "joi";
import { collectionEvents } from "../index.js";

const eventSchema = joi.object({
    description: joi.string().required().min(3).max(30),
    value: joi.number().required()
    //operation: joi.string().required().valid("add", "sub")
});

export async function addEvent(req, res) {
    const { description, value } = req.body;

    const date = new Date();
    const currentDate = date.getDate() + "/" + (date.getMonth() + 1);

    try {
        const validation = eventSchema.validate({ description, value }, { abortEarly: false });

        if (validation.error) {
            const err = validation.error.details.map((d) => d.message);
            return res.status(422).send(err);            
        };

        await collectionEvents.insertOne({
            date: currentDate,
            description: description,
            value: value
        });
        
        res.sendStatus(500);

    } catch (err) {
        res.status().send(err);
    }
};

export async function getEvents(req, res) {
    try {
        const events = await collectionEvents.find().toArray();
        res.status(200).send(events);

    } catch (err) {
        res.status(500).send(err);
    };   
};
