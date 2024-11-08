import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { createClient } from "redis";
import axios from "axios";

dotenv.config();

const prisma = new PrismaClient();
// const redis = createClient({ url: process.env.REDIS_URL });
// redis.connect();

const githubCallbackHandler = async (req, res) => {
    const { code } = req.query;
    const response = await axios({
        method: "post",
        url: `https://github.com/login/oauth/access_token?client_id=${process.env.GH_CLIENT_ID}&client_secret=${process.env.GH_CLIENT_SECRET}&code=${code}`,
        headers: {
            accept: "application/json",
        },
    }).then((r) => r.data);
    const accessToken = response.access_token;
    console.log(accessToken)
    const userData = await axios.get("https://api.github.com/user", {
        headers: {
            Authorization: "token " + accessToken,
            "X-OAuth-Scopes": "repo, user",
            "X-Accepted-OAuth-Scopes": "user",
        },
        validateStatus: false,
    });
    const userEmailData = await axios.get(
        "https://api.github.com/user/emails",
        {
            headers: {
                Authorization: "token " + accessToken,
                "X-OAuth-Scopes": "repo, user",
                "X-Accepted-OAuth-Scopes": "user",
            },
            validateStatus: false,
        },
    );
    console.log(userData.data);
    console.log(userEmailData.data.find((email) => email.primary).email);

    res.redirect(`http://localhost:5173/`);
};

export { githubCallbackHandler };
