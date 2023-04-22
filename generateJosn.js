const openai = require('openai');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();

// Authenticate OpenAI API
openai.api_key = process.env.OPENAI_API_KEY;

// Define function to generate JSON data using OpenAI
async function generateJsonFile(speaker_name, content) {
    try {
        // Define the members present in the podcast
        const members = ["Elon Musk", "Jeff Bezos", "Steve Jobs"];

        // Use OpenAI's GPT-3 to determine the appropriate look_at value
        let prompt = `Speaker: ${speaker_name}\nContent: ${content}\n`;
        prompt += `Which member of the podcast should the speaker direct their gaze towards? `;
        prompt += `Members present: ${members.filter(m => m !== speaker_name).join(' ')}\n`;
        prompt += 'Just give the first name'
        const response1 = await openai.Completion.create({
            engine: "text-davinci-002-turbo",
            prompt: prompt,
            n: 1,
            stop: null,
            temperature: 0.5,
        });
        const look_at = response1.choices[0].text.trim();

        // Use OpenAI's GPT-3 to determine the appropriate animation
        prompt = `Speaker: ${speaker_name}\nContent: ${content}\n`;
        prompt += `Who should the speaker look at while saying this: ${look_at}\n`;
        prompt += `Which animation should be played from among sitting, idle, pointing, angry, sad?`;
        prompt += 'Give the response in one word'
        const response2 = await openai.Completion.create({
            engine: "text-davinci-002-turbo",
            prompt: prompt,
            n: 1,
            stop: null,
            temperature: 0.5,
        });
        const animation = response2.choices[0].text.trim();

        // Create the JSON data
        const data = {
            "speaker": speaker_name,
            "content": content,
            "lookAt": look_at,
            "animation": animation
        };
        appendToPodcastFile(data)
        // Return the JSON data
        return data;
    } catch (error) {
        // Handle errors
        console.error(error);
        throw new Error('Failed to generate JSON data');
    }
}



function appendToPodcastFile(data) {
  const filePath = './podcast.json';

  // If the file exists, append new data to it
  if (fs.existsSync(filePath)) {
    const existingData = fs.readFileSync(filePath);
    const newData = JSON.parse(existingData).concat(data);
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
  }
  // If the file does not exist, create it and add the data
  else {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }
}

module.exports = generateJsonFile