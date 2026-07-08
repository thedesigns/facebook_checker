const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and urlencoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Credentials Config
const AUTH_USERNAME = 's9895718009';
const AUTH_PASSWORD = 'BIZ@whatz_3335596333';
const AUTH_TOKEN = 'secure_session_token_biz_whatz_3335596333_dev_studio';

// Auth endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Please provide both username and password.' });
  }

  if (username.trim().toLowerCase() === AUTH_USERNAME.toLowerCase() && password === AUTH_PASSWORD) {
    res.json({ success: true, token: AUTH_TOKEN });
  } else {
    res.status(401).json({ success: false, error: 'Invalid username or password.' });
  }
});

// CORS proxy endpoint
app.post('/api/proxy', async (req, res) => {
  // Verify authorization token
  const clientToken = req.headers['x-auth-token'];
  if (clientToken !== AUTH_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing session token.' });
  }

  const { path: apiPath, method, headers, queryParams, body, isJson } = req.body;

  if (!apiPath) {
    return res.status(400).json({ error: 'Missing API path in proxy request.' });
  }

  // Construct target Meta Graph URL
  // Strip any leading slashes to prevent double slashes
  const cleanPath = apiPath.startsWith('/') ? apiPath.substring(1) : apiPath;
  let targetUrl = `https://graph.facebook.com/v20.0/${cleanPath}`;

  // Append query params if present
  if (queryParams && Object.keys(queryParams).length > 0) {
    const searchParams = new URLSearchParams();
    for (const [key, val] of Object.entries(queryParams)) {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, val);
      }
    }
    const queryString = searchParams.toString();
    if (queryString) {
      targetUrl += `?${queryString}`;
    }
  }

  console.log(`[PROXY] Forwarding ${method} to: ${targetUrl}`);

  try {
    const fetchOptions = {
      method: method || 'GET',
      headers: {
        ...headers
      }
    };

    // If there is a body and it is not a GET/HEAD request, attach it
    if (body && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      if (isJson) {
        fetchOptions.headers['Content-Type'] = 'application/json';
        fetchOptions.body = typeof body === 'object' ? JSON.stringify(body) : body;
      } else {
        // Form urlencoded or plain text
        fetchOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        if (typeof body === 'object') {
          const formParams = new URLSearchParams();
          for (const [key, val] of Object.entries(body)) {
            formParams.append(key, val);
          }
          fetchOptions.body = formParams.toString();
        } else {
          fetchOptions.body = body;
        }
      }
    }

    const startTime = Date.now();
    const response = await fetch(targetUrl, fetchOptions);
    const duration = Date.now() - startTime;

    const contentType = response.headers.get('content-type') || '';
    let responseData;

    if (contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = { text: await response.text() };
    }

    // Extract headers we want to send back
    const responseHeaders = {};
    response.headers.forEach((val, key) => {
      responseHeaders[key] = val;
    });

    res.status(response.status).json({
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      data: responseData,
      duration: `${duration}ms`
    });

  } catch (error) {
    console.error('[PROXY ERROR]', error);
    res.status(500).json({
      error: 'Proxy encountered a network or connection error.',
      details: error.message
    });
  }
});

// Webhook state (in-memory)
let webhookVerifyToken = 'secure_webhook_verify_token_3335596333';
let receivedWebhooks = [];

// GET Webhook verification challenge
app.get('/api/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === webhookVerifyToken) {
    console.log('[WEBHOOK] Verification successful.');
    return res.status(200).send(challenge);
  } else {
    console.warn('[WEBHOOK] Verification failed. Expected:', webhookVerifyToken, 'Received:', token);
    return res.status(403).send('Forbidden');
  }
});

// POST Webhook event receiver
app.post('/api/webhook', (req, res) => {
  const timestamp = new Date().toISOString();
  const webhookEvent = {
    id: Date.now() + Math.random().toString(36).substr(2, 9),
    timestamp,
    headers: req.headers,
    query: req.query,
    body: req.body
  };

  console.log(`[WEBHOOK RECEIVED] ${timestamp}`);
  receivedWebhooks.unshift(webhookEvent);

  // Keep last 50 webhooks
  if (receivedWebhooks.length > 50) {
    receivedWebhooks.pop();
  }

  res.status(200).json({ success: true });
});

// GET list of received webhooks
app.get('/api/webhooks', (req, res) => {
  res.json(receivedWebhooks);
});

// POST update webhook settings
app.post('/api/webhook/settings', (req, res) => {
  const { verifyToken } = req.body;
  if (verifyToken !== undefined) {
    webhookVerifyToken = verifyToken.trim();
    console.log(`[WEBHOOK] Verify token updated to: ${webhookVerifyToken}`);
    return res.json({ success: true, verifyToken: webhookVerifyToken });
  }
  res.status(400).json({ error: 'Missing verifyToken parameter' });
});

// POST clear webhooks log
app.post('/api/webhooks/clear', (req, res) => {
  receivedWebhooks = [];
  res.json({ success: true });
});

// Fallback to serving the SPA for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Meta WhatsApp API Local Tester Running Successfully!`);
  console.log(`🔗 Local Address: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});

module.exports = app;
