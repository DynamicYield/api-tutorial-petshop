const axios = require('axios');
require('dotenv').config();

const APIKEY = process.env.DY_API_KEY || 'YOUR-KEY-HERE';
const DYHOST = process.env.DY_HOST || 'https://dy-api.com';

const apiClient = axios.create({
  baseURL: DYHOST,
  headers: {
    'DY-API-Key': APIKEY,
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

async function choose(userId, sessionId, dyContext, selectors = []) {
  let variations = {};
  try {
    const response = await apiClient.post('/v2/serve/user/choose', {
      selector: {
        names: selectors,
      },
      user: {
        id: userId,
      },
      sessionId,
      context: dyContext,
    });
    variations = response.data.choices.reduce(flattenCampaignData, {});
    console.log(`Choices by campaign: ${JSON.stringify(variations, null, 2)}`);
  } catch (e) {
    console.error(`ERROR IN CHOOSE: ${e.message}`);
  }
  return variations;
}

function flattenCampaignData(res, choice) {
  let data = null;
  if (choice.variations.length > 0) {
    switch (choice.type) {
      case 'DECISION':
        data = { decisionId: choice.decisionId, ...choice.variations[0].payload.data };
        break;
      case 'RECS_DECISION':
        data = choice.variations[0].payload.data.slots.map(
                  slot => ({ ...slot.productData, sku: slot.sku, slotId: slot.slotId }));
        break;
      default:
        throw new Error('Unknown choice type: ' + choice.type);
    }
  }

  res[choice.name] = data;
  return res;
}

async function reportClick(userId, sessionId, engagement) {
  try {
    await apiClient.post('/v2/collect/user/engagement', {
      user: {
        id: userId,
      },
      sessionId,
      engagements: [engagement],
    });
    console.log("Engagement reported: " + JSON.stringify(engagement));
  } catch (e) {
    console.error(`ERROR IN ENGAGEMENT: ${e.message}`);
  }
}

async function reportEvent(userId, sessionId, event) {
  try {
    await apiClient.post('/v2/collect/user/event', {
      user: {
        id: userId,
      },
      sessionId,
      events: [event],
    });
    console.log("Event reported: " + JSON.stringify(event));
  } catch (e) {
    console.error(`ERROR IN EVENT: ${e.message}`);
  }
}

module.exports = {
  choose,
  reportClick,
  reportEvent
};