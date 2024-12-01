const fetch = require('node-fetch')

async function gpt3(query) {
    const url = 'https://shinoa.us.kg/api/gpt/gpt3';
    const headers = {
        'accept': '*/*',
        'api_key': 'kyuurzy',
        'Content-Type': 'application/json'
    };
    const body = JSON.stringify({
        text: query
    });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Request failed:', error);
        throw error;
    }
}

module.exports = { gpt3 }