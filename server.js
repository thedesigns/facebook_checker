const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and urlencoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// CORS proxy endpoint
app.post('/api/proxy', async (req, res) => {
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
