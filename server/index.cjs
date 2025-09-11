const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require("body-parser");
require("dotenv").config({ path: '../.env' });
app.use(bodyParser.json());
app.use(cors());

const apiurl = process.env.GEMINI_API_URL
const apikey = process.env.GEMINI_API_KEY

console.log(apiurl, apikey);

const GEMINI_URL = `${apiurl}?key=${apikey}`;

app.get('/', (req, res) => {
    res.send("working");
})

app.post("/api/generate", async (req, res) => {
    const userData = req.body.data;
    console.log(userData);
    const userPrompt = `${req.body.prompt} ${userData} Ensure the README is clear, well-organized, and includes code blocks or examples where helpful. Use concise language. Do not invent information — only use what's provided.`;
    const response = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: userPrompt }], role: "user" }]
        }),
    });

    const data = await response.json();
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    res.json({ result });
});
app.listen(port, () => {
    console.log("server running");
})