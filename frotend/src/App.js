const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// Utility function to delay execution
const delay = ms => new Promise(res => setTimeout(res, ms));

// Endpoint to execute share actions
app.post('/api/execute', async (req, res) => {
  const { cookie, postLink, count, delayTime } = req.body;
  const headers = {
    'User-Agent': 'Mozilla/5.0',
    'Cookie': cookie
  };

  try {
    // Fetch access token from Facebook
    const response = await axios.get('https://business.facebook.com/content_management', { headers });
    const tokenMatch = response.data.match(/EAAG\w+/);
    if (!tokenMatch) return res.status(400).json({ error: 'Invalid cookie or token not found.' });
    const accessToken = tokenMatch[0];

    let successCount = 0;
    for (let i = 0; i < count; i++) {
      await delay(delayTime);
      const shareResponse = await axios.post(`${process.env.XNXX}${postLink}&published=0&access_token=${accessToken}`, {}, { headers });
      if (shareResponse.data.id) {
        successCount++;
      } else {
        break;
      }
    }

    res.json({ success: successCount, total: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Additional endpoints for login and cookie check can be added similarly

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
