const router = require('express').Router();
const DYAPI = require('../DYAPI');

router.post('/', (req, res) => {
  const payload = req.body;
  DYAPI.reportClick(req.userId, req.sessionId, payload);
});

module.exports = router;