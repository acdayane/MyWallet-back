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
    const currentDate = date.getDate() + "/" + (date.getMonth()+1);

    try {
        const validation = eventSchema.validate({ description, value }, { abortEarly: false });

        if (validation.error) {
            const err = validation.error.details.map((d) => d.message);
            res.status(422).send(err);
            return;
        };

        const evento = await collectionEvents.insertOne({
            date: currentDate,
            description: description,
            value: value
        });
        
    } catch (err) {
        res.status(404).send(err);
    }
};