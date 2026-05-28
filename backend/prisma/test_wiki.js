const axios = require('axios');
const fs = require('fs');

async function test() {
  try {
    const response = await axios({
      url: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/IIT_Bombay_Main_Building.jpg',
      responseType: 'arraybuffer',
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      }
    });
    console.log("Success! Size:", response.data.length);
  } catch (e) {
    console.log("Failed:", e.message, e.response?.status);
  }
}
test();
