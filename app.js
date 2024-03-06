// app.js
const express = require('express');

const OpenAI = require("openai");

const app = express();

const port = 3000;

app.use(express.json());

app.post('/complete_chat', async (req, res) => {

    try {

        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {

            return res.status(401).json({
                error: 'Unauthorized - Bearer token missing'
            });

        }

        const apiKey1 = authHeader.substring('Bearer '.length);

        const openai = new OpenAI({
            apiKey: apiKey1
        });

        console.log(openai);

        if (!req.body.partial_text) {

            return res.status(400).json({
                error: 'Partial text is required in the request body'
            });

        }

        const partialText = req.body.partial_text;

        console.log("request", partialText);

        const response = await openai.chat.completions.create({

            model: "gpt-3.5-turbo",

            messages: [{
                "role": "user",
                "content": partialText
            }],

            max_tokens: 100

        });

        console.log(response);

        if (!response || !response.data || !response.data.choices || response.data.choices.length === 0) {

            return res.status(500).json({
                error: 'Empty or invalid response from OpenAI API'
            });

        }

        const completedText = response.data.choices[0].message.content;

        res.json({
            completed_text: completedText
        });

    } catch (error) {

        console.error('Error:', error.message);

        res.status(500).json({
            error: 'Internal Server Error'
        });

    }

});
// Start server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
