/**
 * Debug routes - DO NOT USE IN PRODUCTION
 * This file contains intentionally vulnerable code for CodeQL testing purposes.
 */

const router = require('express').Router();
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Vulnerability 1: Command Injection (CWE-78)
 * User-supplied `filename` is passed directly into a shell command.
 * CodeQL query: js/command-line-injection
 *
 * Example exploit: GET /debug/ping?host=127.0.0.1;cat+/etc/passwd
 */
router.get('/ping', (req, res) => {
  const { host } = req.query;
  exec(`ping -c 1 ${host}`, (error, stdout, stderr) => {
    if (error) {
      res.status(500).json({ error: stderr });
      return;
    }
    res.json({ output: stdout });
  });
});

/**
 * Vulnerability 2: Open Redirect (CWE-601)
 * The redirect target is taken directly from user input with no validation.
 * CodeQL query: js/unvalidated-dynamic-method-call / js/open-url-redirection
 *
 * Example exploit: GET /debug/redirect?url=https://evil.com
 */
router.get('/redirect', (req, res) => {
  const { url } = req.query;
  res.redirect(url);
});

/**
 * Vulnerability 3: Path Traversal (CWE-22)
 * User-supplied `file` query param is used to build a file path without sanitization.
 * CodeQL query: js/path-injection
 *
 * Example exploit: GET /debug/file?name=../../etc/passwd
 */
router.get('/file', (req, res) => {
  const { name } = req.query;
  const filePath = path.join(__dirname, '../public', name);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(404).json({ error: 'File not found' });
      return;
    }
    res.send(data);
  });
});

module.exports = router;
