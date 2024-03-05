// app.js
const express = require('express');
const https = require('https');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Define a route to handle input and send to OpenAI API
app.post('/complete_chat', async (req, res) => {
    try {
        // Get user input from request body
        const partialText = req.body.partial_text;

        // Replace 'YOUR_API_KEY' with your actual OpenAI API key
        const apiKey = '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';

        // Data to be sent to the OpenAI API
        const requestData = JSON.stringify({
            prompt: partialText,
            model: 'text-davinci-002', // You can change the model if needed

        });

        // Options for the HTTP request
        const options = {
            hostname: 'api.openai.com',
            path: '/v1/completions',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Content-Length': requestData.length
            }
        };

        // Make the HTTP request to the OpenAI API
        const request = https.request(options, response => {
            let data = '';

            // Receive data from the API
            response.on('data', chunk => {
                data += chunk;
            });

            // Process the response
            response.on('end', () => {
                const responseData = JSON.parse(data);
                if (responseData. choices && responseData. choices.length > 0){
                res. json({completed_text: responseData.choices[0].text });
                } else{
                res.status(500). json({ error: 'Empty response from OpenAI API' });
                }
            });
        });

        // Handle any errors
        request.on('error', error => {
            console.error('Error:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        });

        // Send the request data
        request.write(requestData);
        request.end();
    } catch (error) {
        // Handle any errors
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
