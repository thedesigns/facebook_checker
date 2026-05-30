/**
 * ==========================================================================
 * CONTROLLER SCRIPT: META WHATSAPP DEVELOPER DASHBOARD
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements Selection
  const elToken = document.getElementById('meta-token');
  const elPageId = document.getElementById('meta-page-id');
  const elPhoneId = document.getElementById('meta-phone-id');
  const elWabaId = document.getElementById('meta-waba-id');
  const elAppId = document.getElementById('meta-app-id');
  const elToggleToken = document.getElementById('toggle-token-visibility');
  const elSaveCreds = document.getElementById('btn-save-credentials');
  const elClearCreds = document.getElementById('btn-clear-credentials');
  
  const elActivePresetTitle = document.getElementById('active-preset-title');
  const elReqMethod = document.getElementById('req-method');
  const elReqPath = document.getElementById('req-path');
  const elQueryParamsList = document.getElementById('query-params-list');
  const elBtnAddParam = document.getElementById('btn-add-param');
  
  const elBodyTypeUrlencoded = document.getElementById('body-type-urlencoded');
  const elBodyTypeJson = document.getElementById('body-type-json');
  const elBodyUrlencodedContainer = document.getElementById('body-urlencoded-container');
  const elBodyJsonContainer = document.getElementById('body-json-container');
  const elBodyJsonTextarea = document.getElementById('body-json-textarea');
  
  const elBtnSend = document.getElementById('btn-send-request');
  const elRespStatus = document.getElementById('resp-status');
  const elRespTime = document.getElementById('resp-time');
  const elResponseOutput = document.getElementById('response-output-code');
  const elBtnCopyResp = document.getElementById('btn-copy-response');
  const elHeadersCount = document.getElementById('headers-count');
  const elHeadersList = document.getElementById('response-headers-list');
  const elHeadersDetails = document.getElementById('headers-details');
  
  const elHistoryContainer = document.getElementById('history-items-container');
  const elClearHistory = document.getElementById('btn-clear-history');

  // Authentication Elements
  const elLoginWrapper = document.getElementById('login-wrapper');
  const elAppContainer = document.getElementById('app-container');
  const elLoginForm = document.getElementById('login-form');
  const elLoginUsername = document.getElementById('login-username');
  const elLoginPassword = document.getElementById('login-password');
  const elLoginSubmit = document.getElementById('btn-login-submit');
  const elLoginErrorBanner = document.getElementById('login-error-banner');
  const elLoginErrorMessage = document.getElementById('error-message');
  const elLogoutBtn = document.getElementById('btn-logout');

  // Local State
  let activePreset = 'subscribe_post';
  let historyLogs = [];

  // ==========================================================================
  // API PRESETS DEFINTIONS
  // ==========================================================================
  const PRESETS = {
    subscribe_post: {
      title: 'Subscribe App to Page',
      method: 'POST',
      path: '{page_id}/subscribed_apps',
      bodyType: 'urlencoded',
      queryParams: [],
      bodyFields: [
        { key: 'subscribed_fields', value: 'messages' }
      ],
      jsonBody: ''
    },
    subscribe_get: {
      title: 'List Subscribed Apps',
      method: 'GET',
      path: '{page_id}/subscribed_apps',
      bodyType: 'urlencoded',
      queryParams: [
        { key: 'access_token', value: '{token}' }
      ],
      bodyFields: [],
      jsonBody: ''
    },
    send_template: {
      title: 'Send Template WhatsApp Message',
      method: 'POST',
      path: '{phone_id}/messages',
      bodyType: 'json',
      queryParams: [],
      bodyFields: [],
      jsonBody: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "RECIPIENT_PHONE_NUMBER",
        type: "template",
        template: {
          name: "hello_world",
          language: {
            code: "en_US"
          }
        }
      }, null, 2)
    },
    send_text: {
      title: 'Send Direct WhatsApp Message',
      method: 'POST',
      path: '{phone_id}/messages',
      bodyType: 'json',
      queryParams: [],
      bodyFields: [],
      jsonBody: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "RECIPIENT_PHONE_NUMBER",
        type: "text",
        text: {
          preview_url: false,
          body: "Hello! This is a test message sent from my custom local WhatsApp API Tester."
        }
      }, null, 2)
    },
    phone_details: {
      title: 'Get WABA Phone Number Details',
      method: 'GET',
      path: '{phone_id}',
      bodyType: 'urlencoded',
      queryParams: [
        { key: 'access_token', value: '{token}' }
      ],
      bodyFields: [],
      jsonBody: ''
    },
    custom_get: {
      title: 'Custom GET Endpoint',
      method: 'GET',
      path: 'me',
      bodyType: 'urlencoded',
      queryParams: [
        { key: 'access_token', value: '{token}' }
      ],
      bodyFields: [],
      jsonBody: ''
    },
    custom_post: {
      title: 'Custom POST Endpoint',
      method: 'POST',
      path: '{page_id}/subscribed_apps',
      bodyType: 'json',
      queryParams: [],
      bodyFields: [],
      jsonBody: '{\n  \n}'
    }
  };

  // ==========================================================================
  // CREDENTIALS MANAGEMENT
  // ==========================================================================
  
  // Show / Hide Password for Token
  elToggleToken.addEventListener('click', () => {
    if (elToken.type === 'password') {
      elToken.type = 'text';
      elToggleToken.innerHTML = `<svg id="eye-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
    } else {
      elToken.type = 'password';
      elToggleToken.innerHTML = `<svg id="eye-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
    }
  });

  // Save Credentials to LocalStorage
  elSaveCreds.addEventListener('click', () => {
    const creds = {
      token: elToken.value,
      pageId: elPageId.value,
      phoneId: elPhoneId.value,
      wabaId: elWabaId.value,
      appId: elAppId.value
    };
    localStorage.setItem('meta_api_credentials', JSON.stringify(creds));
    
    // Quick notification on button
    const originalText = elSaveCreds.textContent;
    elSaveCreds.textContent = 'Saved!';
    elSaveCreds.style.backgroundColor = 'var(--color-success)';
    setTimeout(() => {
      elSaveCreds.textContent = originalText;
      elSaveCreds.style.backgroundColor = '';
    }, 1500);

    // Refresh active preset fields if they depend on credentials
    applyPreset(activePreset);
  });

  // Clear Credentials
  elClearCreds.addEventListener('click', () => {
    elToken.value = '';
    elPageId.value = '';
    elPhoneId.value = '';
    elWabaId.value = '';
    elAppId.value = '';
    localStorage.removeItem('meta_api_credentials');
    
    // Quick visual notification
    const originalText = elClearCreds.textContent;
    elClearCreds.textContent = 'Cleared!';
    setTimeout(() => {
      elClearCreds.textContent = originalText;
    }, 1500);
  });

  // Load Credentials
  function loadCredentials() {
    const raw = localStorage.getItem('meta_api_credentials');
    if (raw) {
      try {
        const creds = JSON.parse(raw);
        elToken.value = creds.token || '';
        elPageId.value = creds.pageId || '';
        elPhoneId.value = creds.phoneId || '';
        elWabaId.value = creds.wabaId || '';
        elAppId.value = creds.appId || '';
      } catch (e) {
        console.error('Failed to parse credentials', e);
      }
    }
  }

  // ==========================================================================
  // QUERY PARAMETERS & BODY BUILDERS
  // ==========================================================================

  // Add a Query Param Row
  function addQueryParam(key = '', value = '') {
    const row = document.createElement('div');
    row.className = 'param-row';
    row.innerHTML = `
      <input type="text" placeholder="Key" class="param-key" value="${escapeHtml(key)}">
      <input type="text" placeholder="Value" class="param-val" value="${escapeHtml(value)}">
      <button type="button" class="btn-icon-sm remove-row-btn">×</button>
    `;
    
    row.querySelector('.remove-row-btn').addEventListener('click', () => {
      row.remove();
    });
    
    elQueryParamsList.appendChild(row);
  }

  // Add an URL-Encoded Body Field Row
  function addBodyField(key = '', value = '') {
    const row = document.createElement('div');
    row.className = 'param-row';
    row.innerHTML = `
      <input type="text" placeholder="Field Name" class="body-key" value="${escapeHtml(key)}">
      <input type="text" placeholder="Field Value" class="body-val" value="${escapeHtml(value)}">
      <button type="button" class="btn-icon-sm remove-row-btn">×</button>
    `;
    
    row.querySelector('.remove-row-btn').addEventListener('click', () => {
      row.remove();
    });
    
    elBodyUrlencodedContainer.appendChild(row);
  }

  elBtnAddParam.addEventListener('click', () => addQueryParam());

  // Handle Radio Toggle for Body Types (Urlencoded vs JSON)
  function toggleBodyType(type) {
    if (type === 'urlencoded') {
      elBodyTypeUrlencoded.checked = true;
      elBodyUrlencodedContainer.classList.remove('hidden');
      elBodyJsonContainer.classList.add('hidden');
    } else {
      elBodyTypeJson.checked = true;
      elBodyUrlencodedContainer.classList.add('hidden');
      elBodyJsonContainer.classList.remove('hidden');
    }
  }

  elBodyTypeUrlencoded.addEventListener('change', () => toggleBodyType('urlencoded'));
  elBodyTypeJson.addEventListener('change', () => toggleBodyType('json'));

  // ==========================================================================
  // PRESET APPLICATIONS
  // ==========================================================================
  
  function applyPreset(presetKey) {
    const preset = PRESETS[presetKey];
    if (!preset) return;

    activePreset = presetKey;
    
    // Toggle active state in sidebar
    document.querySelectorAll('.preset-btn').forEach(btn => {
      if (btn.getAttribute('data-preset') === presetKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update Titles and basic fields
    elActivePresetTitle.textContent = preset.title;
    elReqMethod.value = preset.method;
    
    // Substitute ID shortcuts
    const targetPath = substituteVariables(preset.path);
    elReqPath.value = targetPath;

    // Reset Parameters list
    elQueryParamsList.innerHTML = '';
    preset.queryParams.forEach(p => {
      addQueryParam(p.key, substituteVariables(p.value));
    });

    // Handle Body fields
    elBodyUrlencodedContainer.innerHTML = '';
    preset.bodyFields.forEach(b => {
      addBodyField(b.key, substituteVariables(b.value));
    });

    if (preset.jsonBody) {
      elBodyJsonTextarea.value = substituteVariables(preset.jsonBody);
    } else {
      elBodyJsonTextarea.value = '';
    }

    // Toggle forms visual appearance
    toggleBodyType(preset.bodyType);

    // Dynamic visibility check: GET requests don't show request bodies
    if (preset.method === 'GET') {
      document.getElementById('body-section').classList.add('hidden');
    } else {
      document.getElementById('body-section').classList.remove('hidden');
    }
  }

  // Handle Preset Clicks
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const presetKey = btn.getAttribute('data-preset');
      applyPreset(presetKey);
    });
  });

  // Watch Request Method to automatically toggle body panel visibility
  elReqMethod.addEventListener('change', () => {
    const val = elReqMethod.value;
    if (val === 'GET') {
      document.getElementById('body-section').classList.add('hidden');
    } else {
      document.getElementById('body-section').classList.remove('hidden');
    }
  });

  // ==========================================================================
  // UTILITY VARIABLES REPLACEMENT & ESCAPING
  // ==========================================================================
  function substituteVariables(templateStr) {
    if (!templateStr) return '';
    let res = templateStr;
    
    const pageId = elPageId.value || '721001787473104';
    const phoneId = elPhoneId.value || '1419051192998404';
    const wabaId = elWabaId.value || 'WABA_ACCOUNT_ID';
    const appId = elAppId.value || 'APP_ID';
    const token = elToken.value || 'ACCESS_TOKEN';

    res = res.replace(/{page_id}/g, pageId);
    res = res.replace(/{phone_id}/g, phoneId);
    res = res.replace(/{waba_id}/g, wabaId);
    res = res.replace(/{app_id}/g, appId);
    res = res.replace(/{token}/g, token);

    return res;
  }

  function escapeHtml(string) {
    return String(string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ==========================================================================
  // DISPATCH REQUEST (THE RUNNER)
  // ==========================================================================

  elBtnSend.addEventListener('click', async () => {
    const method = elReqMethod.value;
    const rawPath = elReqPath.value;
    const finalPath = substituteVariables(rawPath);
    const token = elToken.value;

    if (!token) {
      alert('Missing Access Token. Please enter a Meta Access Token under API Credentials.');
      elToken.focus();
      return;
    }

    // Set Loading state
    elBtnSend.disabled = true;
    elBtnSend.querySelector('.btn-text').textContent = 'Sending...';
    elBtnSend.querySelector('.btn-spinner').classList.remove('hidden');

    // Build Headers
    const headers = {};
    headers['Authorization'] = `Bearer ${token}`;

    // Read Query Params
    const queryParams = {};
    const paramRows = elQueryParamsList.querySelectorAll('.param-row');
    paramRows.forEach(row => {
      const key = row.querySelector('.param-key').value.trim();
      const val = row.querySelector('.param-val').value.trim();
      if (key) {
        queryParams[key] = substituteVariables(val);
      }
    });

    // Read Body (if POST/PUT/DELETE)
    let body = null;
    let isJson = false;

    if (method !== 'GET') {
      const isJsonSelected = elBodyTypeJson.checked;
      if (isJsonSelected) {
        isJson = true;
        try {
          const rawJson = elBodyJsonTextarea.value.trim();
          body = rawJson ? JSON.parse(substituteVariables(rawJson)) : {};
        } catch (e) {
          alert('Invalid JSON in Request Body. Please fix the JSON formatting.');
          elBodyJsonTextarea.focus();
          // Reset button
          elBtnSend.disabled = false;
          elBtnSend.querySelector('.btn-text').textContent = 'Execute Request';
          elBtnSend.querySelector('.btn-spinner').classList.add('hidden');
          return;
        }
      } else {
        // Form urlencoded
        body = {};
        const bodyRows = elBodyUrlencodedContainer.querySelectorAll('.param-row');
        bodyRows.forEach(row => {
          const key = row.querySelector('.body-key').value.trim();
          const val = row.querySelector('.body-val').value.trim();
          if (key) {
            body[key] = substituteVariables(val);
          }
        });
      }
    }

    // Prepare proxy payload
    const payload = {
      path: finalPath,
      method,
      headers,
      queryParams,
      body,
      isJson
    };

    try {
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': localStorage.getItem('auth_token') || ''
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      // Update UI Output
      displayResponse(result);

      // Add to History logs
      saveToHistory(method, finalPath, result.status, result.duration || '0ms');

    } catch (err) {
      console.error(err);
      displayResponse({
        status: 500,
        statusText: 'Local Client Error',
        data: {
          error: 'Connection refused or server proxy offline.',
          details: err.message
        },
        headers: {},
        duration: '0ms'
      });
      saveToHistory(method, finalPath, 500, '0ms');
    } finally {
      // Revert button status
      elBtnSend.disabled = false;
      elBtnSend.querySelector('.btn-text').textContent = 'Execute Request';
      elBtnSend.querySelector('.btn-spinner').classList.add('hidden');
    }
  });

  // Display raw response on Output Screen
  function displayResponse(result) {
    const status = result.status;
    const time = result.duration;

    // Status classes
    elRespStatus.className = 'status-badge';
    elRespStatus.textContent = `${status} ${result.statusText || ''}`;
    
    if (status >= 200 && status < 300) {
      elRespStatus.classList.add('status-2xx');
    } else if (status >= 400 && status < 500) {
      elRespStatus.classList.add('status-4xx');
    } else {
      elRespStatus.classList.add('status-5xx');
    }

    elRespTime.textContent = time;

    // Output JSON
    elResponseOutput.textContent = JSON.stringify(result.data, null, 2);

    // Headers count and rendering
    const headers = result.headers || {};
    const keys = Object.keys(headers);
    elHeadersCount.textContent = keys.length;
    
    if (keys.length > 0) {
      elHeadersList.innerHTML = keys.map(k => `
        <div class="header-pair">
          <span class="header-name">${escapeHtml(k)}:</span>
          <span class="header-value">${escapeHtml(headers[k])}</span>
        </div>
      `).join('');
    } else {
      elHeadersList.innerHTML = '<p class="muted-text">No active response headers loaded.</p>';
    }

    // Force accordion details closed by default to avoid clutter
    elHeadersDetails.open = false;
  }

  // Copy Response Code
  elBtnCopyResp.addEventListener('click', () => {
    const text = elResponseOutput.textContent;
    navigator.clipboard.writeText(text).then(() => {
      const copySpan = elBtnCopyResp.querySelector('.copy-text');
      copySpan.textContent = 'Copied!';
      setTimeout(() => {
        copySpan.textContent = 'Copy';
      }, 1500);
    });
  });

  // ==========================================================================
  // HISTORY PERSISTENCE & RESTORE
  // ==========================================================================

  function saveToHistory(method, path, status, duration) {
    const timestamp = new Date().toLocaleTimeString();
    const historyItem = {
      id: Date.now(),
      method,
      path,
      status,
      duration,
      timestamp,
      // Capture full config state to restore
      config: {
        method,
        path,
        queryParams: getQueryParamsState(),
        bodyType: elBodyTypeJson.checked ? 'json' : 'urlencoded',
        bodyFields: getBodyFieldsState(),
        jsonBody: elBodyJsonTextarea.value
      }
    };

    historyLogs.unshift(historyItem);
    // Limit history list to 25 items
    if (historyLogs.length > 25) {
      historyLogs.pop();
    }

    localStorage.setItem('meta_api_history', JSON.stringify(historyLogs));
    renderHistory();
  }

  function getQueryParamsState() {
    const list = [];
    elQueryParamsList.querySelectorAll('.param-row').forEach(row => {
      const key = row.querySelector('.param-key').value;
      const val = row.querySelector('.param-val').value;
      list.push({ key, value: val });
    });
    return list;
  }

  function getBodyFieldsState() {
    const list = [];
    elBodyUrlencodedContainer.querySelectorAll('.param-row').forEach(row => {
      const key = row.querySelector('.body-key').value;
      const val = row.querySelector('.body-val').value;
      list.push({ key, value: val });
    });
    return list;
  }

  function renderHistory() {
    if (historyLogs.length === 0) {
      elHistoryContainer.innerHTML = `
        <div class="history-placeholder">
          <p>No recent requests.</p>
          <p class="muted-subtext">Executed requests will appear here for easy playback.</p>
        </div>
      `;
      return;
    }

    elHistoryContainer.innerHTML = historyLogs.map(item => {
      const isSuccess = item.status >= 200 && item.status < 300;
      return `
        <div class="history-item" data-id="${item.id}">
          <div class="history-item-top">
            <div class="history-item-meta">
              <span class="history-dot ${isSuccess ? 'success' : 'error'}"></span>
              <span class="badge ${item.method.toLowerCase()}">${item.method}</span>
              <span class="history-path" title="${escapeHtml(item.path)}">${escapeHtml(item.path)}</span>
            </div>
            <span class="history-time">${item.timestamp}</span>
          </div>
          <div class="history-summary">
            Status: ${item.status} • latency: ${item.duration}
          </div>
        </div>
      `;
    }).join('');

    // Attach click events to load states
    elHistoryContainer.querySelectorAll('.history-item').forEach(el => {
      el.addEventListener('click', () => {
        const id = parseInt(el.getAttribute('data-id'));
        const item = historyLogs.find(h => h.id === id);
        if (item) {
          restoreHistoryState(item.config);
        }
      });
    });
  }

  function restoreHistoryState(config) {
    activePreset = ''; // Clear preset highlight since we modified inputs
    document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
    elActivePresetTitle.textContent = 'Custom Replayed Request';

    elReqMethod.value = config.method;
    elReqPath.value = config.path;

    // Restore query params
    elQueryParamsList.innerHTML = '';
    config.queryParams.forEach(q => {
      addQueryParam(q.key, q.value);
    });

    // Restore body fields
    elBodyUrlencodedContainer.innerHTML = '';
    config.bodyFields.forEach(b => {
      addBodyField(b.key, b.value);
    });

    // Restore JSON fields
    elBodyJsonTextarea.value = config.jsonBody;
    
    // Toggle visual panels
    toggleBodyType(config.bodyType);
    
    if (config.method === 'GET') {
      document.getElementById('body-section').classList.add('hidden');
    } else {
      document.getElementById('body-section').classList.remove('hidden');
    }
  }

  elClearHistory.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear your request history?')) {
      historyLogs = [];
      localStorage.removeItem('meta_api_history');
      renderHistory();
    }
  });

  function loadHistory() {
    const raw = localStorage.getItem('meta_api_history');
    if (raw) {
      try {
        historyLogs = JSON.parse(raw);
        renderHistory();
      } catch (e) {
        console.error('Failed to parse history logs', e);
      }
    }
  }

  // ==========================================================================
  // AUTHENTICATION LOGIC
  // ==========================================================================

  // Check login state on startup
  function checkAuthState() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      elLoginWrapper.classList.add('hidden');
      elAppContainer.classList.remove('hidden');
      loadCredentials();
      loadHistory();
      applyPreset('subscribe_post');
    } else {
      elLoginWrapper.classList.remove('hidden');
      elAppContainer.classList.add('hidden');
    }
  }

  // Handle Login Form Submission
  elLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = elLoginUsername.value.trim();
    const password = elLoginPassword.value;
    
    // UI Loading state
    elLoginSubmit.disabled = true;
    elLoginSubmit.querySelector('.btn-text').textContent = 'Authenticating...';
    elLoginSubmit.querySelector('.btn-spinner').classList.remove('hidden');
    elLoginErrorBanner.classList.add('hidden');
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Save token and initialize app
        localStorage.setItem('auth_token', result.token);
        
        // Add a smooth fade-out / fade-in experience
        elLoginWrapper.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        elLoginWrapper.style.opacity = '0';
        elLoginWrapper.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
          checkAuthState();
          // Reset styling
          elLoginWrapper.style.opacity = '';
          elLoginWrapper.style.transform = '';
        }, 300);
      } else {
        // Show error message
        elLoginErrorMessage.textContent = result.error || 'Invalid credentials. Please try again.';
        elLoginErrorBanner.classList.remove('hidden');
      }
    } catch (err) {
      console.error(err);
      elLoginErrorMessage.textContent = 'Network error. Make sure the Node server is running.';
      elLoginErrorBanner.classList.remove('hidden');
    } finally {
      // Revert loading state
      elLoginSubmit.disabled = false;
      elLoginSubmit.querySelector('.btn-text').textContent = 'Access Workspace';
      elLoginSubmit.querySelector('.btn-spinner').classList.add('hidden');
    }
  });

  // Handle Logout Button Click
  elLogoutBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to log out of the session?')) {
      localStorage.removeItem('auth_token');
      // Simple and secure reload or state transition
      checkAuthState();
      // Clear password field
      elLoginPassword.value = '';
    }
  });

  // ==========================================================================
  // APP INITIALIZATION
  // ==========================================================================
  checkAuthState();
});
