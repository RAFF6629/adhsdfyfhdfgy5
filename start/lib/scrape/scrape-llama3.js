const axios = require('axios');

async function llama3_8b(query) {
  try {
    const response = await axios.post('https://shinoa.us.kg/api/gpt/llama3-8b-8192', {
      text: query
    }, {
      headers: {
        'accept': '*/*',
        'api_key': 'kyuurzy',
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = { llama3_8b }