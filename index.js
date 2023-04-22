const express = require('express');
const bodyParser = require('body-parser');
const generateJsonFile = require('./generateJosn')

const app = express();

// Initialize body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('Hello, world!');
  });

// Define route for generating JSON file
app.post('/chat', async (req, res) => {
    try {
        // Get speaker name and content from request body
        const { speaker, content } = req.body;

        // Generate JSON data using OpenAI and function
        const data = await generateJsonFile(speaker, content);

        // Return the JSON data
        res.json(data).status(200);
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
const PORT = 5000
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
