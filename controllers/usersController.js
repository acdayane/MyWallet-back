import joi from "joi";
import bcrypt from "bcrypt";
import db from "../db.js";

const userSchema = joi.object({
    name: joi.string().required().min(2).max(50),
    email: joi.string().required(),
    password: joi.string().required().min(4).max(8),
});

export async function signUp(req, res) {
    const { name, email, password } = req.body;  
 
    try {
        const compareEmail = await db.collection("users").findOne({ email });

        if (compareEmail) {
            return res.status(409).send({ message: `${email} já está cadastrado` });
        };

        const validation = userSchema.validate({ name, email, password }, { abortEarly: false });

        if (validation.error) {
            const err = validation.error.details.map((d) => d.message);
            res.status(422).send(err);
            return;
        };

        const passwordHash = bcrypt.hashSync(password, 2);

        await db.collection("users").insertOne({ name, email, password: passwordHash });

        res.status(201).send("Cadastro realizado com sucesso :)");
        
    } catch (err) {
        res.status(500).send(err);
    }
};

export async function signIn(req, res) {
    const { email, password } = req.body;    

    try {
        const user = await db.collection("users").findOne({ email });
        console.log(password)
        console.log(user.password)

        if (user && bcrypt.compareSync(password, user.password)) {
            res.sendStatus(200);
        }
    } catch (err) {
        res.status(404).send("Usuário ou senha incorretos");
    }
};
