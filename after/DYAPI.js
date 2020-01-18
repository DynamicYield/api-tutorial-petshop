const request = require('request-promise-native');

const APIKEY = 'YOUR-KEY-HERE';
const DYHOST = 'https://dy-api.com';

async function choose(userId, sessionId, dyContext, selectors = []) {
  const options = {
    method: 'POST',
    uri: `${DYHOST}/v2/serve/user/choose`,
    headers: {
      'DY-API-Key': APIKEY,
    },
    body: {
      selector: {
        names: selectors,
      },
      user: {
        id: userId,
      },
      sessionId,
      context: dyContext,
    },
    json: true,
  };

  let variations = {};
  try {
    const response = await request(options);
    variations = response.choices.reduce(flattenCampaignData, {});
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
    const options = {
      method: 'POST',
      url: `${DYHOST}/v2/collect/user/engagement`,
      headers: {
        'DY-API-Key': APIKEY,
      },
      body: {
        user: {
          id: userId,
        },
        sessionId,
        engagements: [engagement],
      },
      json: true,
    }
    const response = await request(options);
    console.log("Engagement reported: " + JSON.stringify(engagement));
  } catch (e) {
    console.error(`ERROR IN ENGAGEMENT: ${e.message}`);
  }
}

async function reportEvent(userId, sessionId, event) {
  try {
    const options = {
      method: 'POST',
      url: `${DYHOST}/v2/collect/user/event`,
      headers: {
        'DY-API-Key': APIKEY,
      },
      body: {
        user: {
          id: userId,
        },
        sessionId,
        events: [event],
      },
      json: true
    };
    const response = await request(options);
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