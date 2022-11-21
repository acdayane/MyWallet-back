import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { collectionUsers, collectionSessions } from "../index.js";

const userSchema = joi.object({
    name: joi.string().required().min(2).max(50),
    email: joi.string().required(),
    password: joi.string().required().min(4).max(8),
});

export async function signUp(req, res) {
    const { name, email, password } = req.body;

    try {
        const compareEmail = await collectionUsers.findOne({ email });

        if (compareEmail) {
            return res.status(409).send({ message: `${email} já está cadastrado` });
        };

        const validation = userSchema.validate({ name, email, password }, { abortEarly: false });

        if (validation.error) {
            const err = validation.error.details.map((d) => d.message);
            return res.status(422).send(err);
        };

        const passwordHash = bcrypt.hashSync(password, 2);

        await collectionUsers.insertOne({
            name,
            email,
            password: passwordHash
        });

        res.status(201).send("Cadastro realizado com sucesso :)");

    } catch (err) {
        res.status(500).send(err);
    }
};

export async function signIn(req, res) {
    const { email, password } = req.body;
    const token = uuid();

    try {
        const userExists = await collectionUsers.findOne({ email });

        if (!userExists) {
            return res.status(401).send({message: "E-mail não cadastrado"});
        };

        const passwordOK = bcrypt.compareSync(password, userExists.password);

        if (!passwordOK) {
            return res.status(401).send({message: "E-mail ou senha incorretos"});
        };

        const openSession = await collectionSessions.findOne({ userId: userExists._id });

        if (openSession) {
            await collectionSessions.deleteOne({ userId: userExists._id });
        };

        await collectionSessions.insertOne({
            userId: userExists._id,
            token
        });

        const userName = userExists.name;

        // const usersOnline = await collectionSessions.find({}).toArray();
        // console.log(usersOnline)

        res.status(200).send({ token, userName });

    } catch (err) {
        res.sendStatus(500);
    }
};

export async function signOut(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const openedSession = await collectionSessions.findOne({ token });

        if (!openedSession) {
            return res.sendStatus(401);
        };

        await collectionSessions.deleteOne({ token });

        res.sendStatus(200);

    } catch (err) {
        res.sendStatus(500);
    };
};