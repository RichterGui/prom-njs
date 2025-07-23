const axios = require('axios');

async function sendRequest() {
  try {
    const res = await axios.get('http://localhost:4000/random');
    console.log(`Status: ${res.status}, Value: ${res.data.value}`);
  } catch (err) {
    console.error('Erro na requisição:', err.message);
  }

    const nextDelay = Math.floor(Math.random() * 50) + 10; 
   setTimeout(sendRequest, nextDelay);
}

sendRequest()