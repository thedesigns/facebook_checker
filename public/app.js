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
  const elAppSecret = document.getElementById('meta-app-secret');
  const elWebhookUrl = document.getElementById('meta-webhook-url');
  const elWebhookVerifyToken = document.getElementById('meta-webhook-verify-token');
  const elFlowId = document.getElementById('meta-flow-id');
  const elToggleToken = document.getElementById('toggle-token-visibility');
  const elSaveCreds = document.getElementById('btn-save-credentials');
  const elClearCreds = document.getElementById('btn-clear-credentials');

  // Sidebar Tab Elements
  const elTabHistory = document.getElementById('tab-history');
  const elTabWebhooks = document.getElementById('tab-webhooks');
  const elSectionHistory = document.getElementById('section-history');
  const elSectionWebhooks = document.getElementById('section-webhooks');
  const elWebhookBadge = document.getElementById('webhook-badge');
  const elWebhookEndpointUrl = document.getElementById('webhook-endpoint-url');
  const elBtnCopyWebhookUrl = document.getElementById('btn-copy-webhook-url');
  const elLocalVerifyToken = document.getElementById('local-verify-token');
  const elBtnSaveLocalToken = document.getElementById('btn-save-local-token');
  const elWebhookItemsContainer = document.getElementById('webhook-items-container');
  const elBtnClearWebhooks = document.getElementById('btn-clear-webhooks');
  
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
    request_code: {
      title: 'Request Verification Code',
      method: 'POST',
      path: '{phone_id}/request_code',
      bodyType: 'json',
      queryParams: [],
      bodyFields: [],
      jsonBody: JSON.stringify({
        code_method: "SMS",
        language: "en"
      }, null, 2)
    },
    verify_code: {
      title: 'Verify Code',
      method: 'POST',
      path: '{phone_id}/verify_code',
      bodyType: 'json',
      queryParams: [],
      bodyFields: [],
      jsonBody: JSON.stringify({
        code: "123456"
      }, null, 2)
    },
    register_number: {
      title: 'Register Number & Create PIN',
      method: 'POST',
      path: '{phone_id}/register',
      bodyType: 'json',
      queryParams: [],
      bodyFields: [],
      jsonBody: JSON.stringify({
        messaging_product: "whatsapp",
        pin: "987654"
      }, null, 2)
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
    },
    // ========== WEBHOOKS PRESETS ==========
    update_webhook_subscription: {
      title: 'Configure Meta App Webhook Subscription',
      method: 'POST',
      path: '{app_id}/subscriptions',
      bodyType: 'urlencoded',
      queryParams: [
        { key: 'access_token', value: '{app_access_token}' }
      ],
      bodyFields: [
        { key: 'object', value: 'whatsapp_business_account' },
        { key: 'callback_url', value: '{webhook_url}' },
        { key: 'verify_token', value: '{webhook_verify_token}' },
        { key: 'fields', value: 'messages' },
        { key: 'active', value: 'true' }
      ],
      jsonBody: ''
    },
    get_webhook_subscriptions: {
      title: 'List Meta App Webhook Subscriptions',
      method: 'GET',
      path: '{app_id}/subscriptions',
      bodyType: 'urlencoded',
      queryParams: [
        { key: 'access_token', value: '{app_access_token}' }
      ],
      bodyFields: [],
      jsonBody: ''
    },
    // ========== FLOWS PRESETS ==========
    create_flow: {
      title: 'Create WhatsApp Flow',
      method: 'POST',
      path: '{waba_id}/flows',
      bodyType: 'json',
      queryParams: [],
      bodyFields: [],
      jsonBody: JSON.stringify({
        name: "My WhatsApp Flow",
        categories: ["OTHER"]
      }, null, 2)
    },
    list_flows: {
      title: 'List All WhatsApp Flows',
      method: 'GET',
      path: '{waba_id}/flows',
      bodyType: 'urlencoded',
      queryParams: [
        { key: 'access_token', value: '{token}' }
      ],
      bodyFields: [],
      jsonBody: ''
    },
    get_flow: {
      title: 'Get Flow Details',
      method: 'GET',
      path: '{flow_id}',
      bodyType: 'urlencoded',
      queryParams: [
        { key: 'access_token', value: '{token}' }
      ],
      bodyFields: [],
      jsonBody: ''
    },
    update_flow: {
      title: 'Update Flow Metadata',
      method: 'POST',
      path: '{flow_id}',
      bodyType: 'json',
      queryParams: [],
      bodyFields: [],
      jsonBody: JSON.stringify({
        name: "Updated Flow Name",
        categories: ["OTHER"]
      }, null, 2)
    },
    publish_flow: {
      title: 'Publish Flow',
      method: 'POST',
      path: '{flow_id}/publish',
      bodyType: 'json',
      queryParams: [],
      bodyFields: [],
      jsonBody: ''
    },
    delete_flow: {
      title: 'Delete Flow',
      method: 'DELETE',
      path: '{flow_id}',
      bodyType: 'urlencoded',
      queryParams: [
        { key: 'access_token', value: '{token}' }
      ],
      bodyFields: [],
      jsonBody: ''
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
      appId: elAppId.value,
      appSecret: elAppSecret.value,
      webhookUrl: elWebhookUrl.value,
      webhookVerifyToken: elWebhookVerifyToken.value,
      flowId: elFlowId.value
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
    elAppSecret.value = '';
    elWebhookUrl.value = '';
    elWebhookVerifyToken.value = '';
    elFlowId.value = '';
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
        elAppSecret.value = creds.appSecret || '';
        elWebhookUrl.value = creds.webhookUrl || '';
        elWebhookVerifyToken.value = creds.webhookVerifyToken || '';
        elFlowId.value = creds.flowId || '';
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
    const appSecret = elAppSecret.value || '';
    const webhookUrl = elWebhookUrl.value || '';
    const webhookVerifyToken = elWebhookVerifyToken.value || '';
    const token = elToken.value || 'ACCESS_TOKEN';
    const flowId = elFlowId.value || 'FLOW_ID';
    const appAccessToken = (appId && appSecret) ? `${appId}|${appSecret}` : token;

    res = res.replace(/{page_id}/g, pageId);
    res = res.replace(/{phone_id}/g, phoneId);
    res = res.replace(/{waba_id}/g, wabaId);
    res = res.replace(/{app_id}/g, appId);
    res = res.replace(/{app_secret}/g, appSecret);
    res = res.replace(/{app_access_token}/g, appAccessToken);
    res = res.replace(/{webhook_url}/g, webhookUrl);
    res = res.replace(/{webhook_verify_token}/g, webhookVerifyToken);
    res = res.replace(/{token}/g, token);
    res = res.replace(/{flow_id}/g, flowId);

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
    let activeToken = token;

    // For webhook subscriptions, use the App Access Token (app_id|app_secret)
    if (activePreset === 'update_webhook_subscription' || activePreset === 'get_webhook_subscriptions') {
      const appId = elAppId.value.trim();
      const appSecret = elAppSecret.value.trim();
      if (appId && appSecret) {
        activeToken = `${appId}|${appSecret}`;
      }
    }

    headers['Authorization'] = `Bearer ${activeToken}`;

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
      startWebhookPolling();
    } else {
      elLoginWrapper.classList.remove('hidden');
      elAppContainer.classList.add('hidden');
      stopWebhookPolling();
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
      stopWebhookPolling();
      // Simple and secure reload or state transition
      checkAuthState();
      // Clear password field
      elLoginPassword.value = '';
    }
  });

  // ==========================================================================
  // FLOWS BUILDER LOGIC
  // ==========================================================================

  const FLOW_TEMPLATES = {
    hello_world: {
      version: "5.0",
      screens: [
        {
          id: "WELCOME",
          title: "Welcome",
          layout: {
            type: "SingleColumnLayout",
            children: [
              {
                type: "TextHeading",
                text: "Hello World!"
              },
              {
                type: "TextBody",
                text: "This is a minimal WhatsApp Flow for testing."
              },
              {
                type: "Footer",
                label: "Done",
                "on-click-action": {
                  name: "complete",
                  payload: {}
                }
              }
            ]
          }
        }
      ]
    },
    sign_up: {
      version: "5.0",
      screens: [
        {
          id: "SIGN_UP",
          title: "Sign Up",
          data: {},
          layout: {
            type: "SingleColumnLayout",
            children: [
              {
                type: "TextHeading",
                text: "Create Your Account"
              },
              {
                type: "TextInput",
                label: "Full Name",
                name: "full_name",
                required: true,
                "input-type": "text"
              },
              {
                type: "TextInput",
                label: "Email Address",
                name: "email",
                required: true,
                "input-type": "email"
              },
              {
                type: "TextInput",
                label: "Phone Number",
                name: "phone",
                required: true,
                "input-type": "phone"
              },
              {
                type: "OptIn",
                label: "I agree to the Terms & Conditions",
                name: "terms_agreed",
                required: true
              },
              {
                type: "Footer",
                label: "Sign Up",
                "on-click-action": {
                  name: "complete",
                  payload: {
                    full_name: "${form.full_name}",
                    email: "${form.email}",
                    phone: "${form.phone}",
                    terms_agreed: "${form.terms_agreed}"
                  }
                }
              }
            ]
          }
        }
      ]
    },
    appointment: {
      version: "5.0",
      screens: [
        {
          id: "APPOINTMENT",
          title: "Book Appointment",
          data: {},
          layout: {
            type: "SingleColumnLayout",
            children: [
              {
                type: "TextHeading",
                text: "Schedule Your Appointment"
              },
              {
                type: "TextInput",
                label: "Your Name",
                name: "customer_name",
                required: true,
                "input-type": "text"
              },
              {
                type: "DatePicker",
                label: "Preferred Date",
                name: "appointment_date",
                required: true
              },
              {
                type: "Dropdown",
                label: "Preferred Time Slot",
                name: "time_slot",
                required: true,
                "data-source": [
                  { id: "morning", title: "9:00 AM - 12:00 PM" },
                  { id: "afternoon", title: "12:00 PM - 3:00 PM" },
                  { id: "evening", title: "3:00 PM - 6:00 PM" }
                ]
              },
              {
                type: "TextArea",
                label: "Additional Notes",
                name: "notes",
                required: false
              },
              {
                type: "Footer",
                label: "Confirm Booking",
                "on-click-action": {
                  name: "complete",
                  payload: {
                    customer_name: "${form.customer_name}",
                    appointment_date: "${form.appointment_date}",
                    time_slot: "${form.time_slot}",
                    notes: "${form.notes}"
                  }
                }
              }
            ]
          }
        }
      ]
    },
    lead_gen: {
      version: "5.0",
      screens: [
        {
          id: "LEAD_FORM",
          title: "Get in Touch",
          data: {},
          layout: {
            type: "SingleColumnLayout",
            children: [
              {
                type: "TextHeading",
                text: "We'd love to hear from you"
              },
              {
                type: "TextBody",
                text: "Fill in your details and our team will reach out shortly."
              },
              {
                type: "TextInput",
                label: "Full Name",
                name: "lead_name",
                required: true,
                "input-type": "text"
              },
              {
                type: "TextInput",
                label: "Email",
                name: "lead_email",
                required: true,
                "input-type": "email"
              },
              {
                type: "TextInput",
                label: "Company",
                name: "lead_company",
                required: false,
                "input-type": "text"
              },
              {
                type: "Dropdown",
                label: "Interested In",
                name: "interest",
                required: true,
                "data-source": [
                  { id: "product_demo", title: "Product Demo" },
                  { id: "pricing", title: "Pricing Information" },
                  { id: "partnership", title: "Partnership Inquiry" },
                  { id: "support", title: "Technical Support" },
                  { id: "other", title: "Other" }
                ]
              },
              {
                type: "Footer",
                label: "Submit",
                "on-click-action": {
                  name: "complete",
                  payload: {
                    lead_name: "${form.lead_name}",
                    lead_email: "${form.lead_email}",
                    lead_company: "${form.lead_company}",
                    interest: "${form.interest}"
                  }
                }
              }
            ]
          }
        }
      ]
    },
    survey: {
      version: "5.0",
      screens: [
        {
          id: "SURVEY",
          title: "Quick Survey",
          data: {},
          layout: {
            type: "SingleColumnLayout",
            children: [
              {
                type: "TextHeading",
                text: "We Value Your Feedback"
              },
              {
                type: "TextBody",
                text: "Help us improve by answering a few quick questions."
              },
              {
                type: "Dropdown",
                label: "How would you rate your experience?",
                name: "rating",
                required: true,
                "data-source": [
                  { id: "5", title: "⭐⭐⭐⭐⭐ Excellent" },
                  { id: "4", title: "⭐⭐⭐⭐ Good" },
                  { id: "3", title: "⭐⭐⭐ Average" },
                  { id: "2", title: "⭐⭐ Poor" },
                  { id: "1", title: "⭐ Very Poor" }
                ]
              },
              {
                type: "Dropdown",
                label: "Would you recommend us?",
                name: "recommend",
                required: true,
                "data-source": [
                  { id: "yes", title: "Yes, definitely" },
                  { id: "maybe", title: "Maybe" },
                  { id: "no", title: "No" }
                ]
              },
              {
                type: "TextArea",
                label: "Any additional comments?",
                name: "comments",
                required: false
              },
              {
                type: "Footer",
                label: "Submit Feedback",
                "on-click-action": {
                  name: "complete",
                  payload: {
                    rating: "${form.rating}",
                    recommend: "${form.recommend}",
                    comments: "${form.comments}"
                  }
                }
              }
            ]
          }
        }
      ]
    },
    custom_empty: {
      version: "5.0",
      screens: []
    }
  };

  // Flows Builder Elements
  const elFlowName = document.getElementById('flow-name');
  const elFlowCategory = document.getElementById('flow-category');
  const elFlowTemplateSelect = document.getElementById('flow-template-select');
  const elFlowJsonEditor = document.getElementById('flow-json-editor');
  const elFlowPublishImmediately = document.getElementById('flow-publish-immediately');
  const elBtnGenerateFlowRequest = document.getElementById('btn-generate-flow-request');

  // Template Selector Handler
  elFlowTemplateSelect.addEventListener('change', () => {
    const templateKey = elFlowTemplateSelect.value;
    const template = FLOW_TEMPLATES[templateKey];
    if (template) {
      elFlowJsonEditor.value = JSON.stringify(template, null, 2);

      // Auto-set category based on template
      const categoryMap = {
        hello_world: 'OTHER',
        sign_up: 'SIGN_UP',
        appointment: 'APPOINTMENT_BOOKING',
        lead_gen: 'LEAD_GENERATION',
        survey: 'SURVEY',
        custom_empty: 'OTHER'
      };
      if (categoryMap[templateKey]) {
        elFlowCategory.value = categoryMap[templateKey];
      }
    }
  });

  // Generate Flow Create Request → Load into Request Studio
  elBtnGenerateFlowRequest.addEventListener('click', () => {
    const flowName = elFlowName.value.trim() || 'My WhatsApp Flow';
    const category = elFlowCategory.value;
    const publishNow = elFlowPublishImmediately.checked;
    const flowJsonRaw = elFlowJsonEditor.value.trim();

    // Validate flow JSON
    if (flowJsonRaw) {
      try {
        JSON.parse(flowJsonRaw);
      } catch (e) {
        alert('Invalid Flow JSON. Please fix the formatting before loading.');
        elFlowJsonEditor.focus();
        return;
      }
    }

    // Build the create flow payload
    const payload = {
      name: flowName,
      categories: [category]
    };

    if (flowJsonRaw && flowJsonRaw !== '{\n  "version": "5.0",\n  "screens": []\n}') {
      payload.flow_json = flowJsonRaw;
    }

    if (publishNow) {
      payload.publish = true;
    }

    // Load into Request Studio
    activePreset = 'create_flow';
    document.querySelectorAll('.preset-btn').forEach(btn => {
      if (btn.getAttribute('data-preset') === 'create_flow') {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    elActivePresetTitle.textContent = 'Create WhatsApp Flow';
    elReqMethod.value = 'POST';
    const wabaId = elWabaId.value || 'WABA_ACCOUNT_ID';
    elReqPath.value = `${wabaId}/flows`;

    // Set body as JSON
    elBodyTypeJson.checked = true;
    toggleBodyType('json');
    elBodyJsonTextarea.value = JSON.stringify(payload, null, 2);

    // Clear query params
    elQueryParamsList.innerHTML = '';

    // Show body section
    document.getElementById('body-section').classList.remove('hidden');

    // Scroll to Request Studio
    document.querySelector('.builder-card').scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Visual feedback
    const btnText = elBtnGenerateFlowRequest.querySelector('.btn-text');
    btnText.textContent = '✅ Loaded!';
    setTimeout(() => {
      btnText.textContent = '⚡ Load into Request Studio';
    }, 1500);
  });

  // ==========================================================================
  // WEBHOOKS MANAGER & LIVE FEED LOGIC
  // ==========================================================================
  
  let activeSidebarTab = 'history';
  let webhookPollInterval = null;
  let lastSeenWebhookCount = 0;
  let totalWebhookCount = 0;
  let webhooksList = [];

  // Initialize Webhook URL Display
  function initWebhookUrl() {
    const origin = window.location.origin;
    const webhookUrl = `${origin}/api/webhook`;
    elWebhookEndpointUrl.textContent = webhookUrl;
  }

  // Copy Webhook URL to Clipboard
  elBtnCopyWebhookUrl.addEventListener('click', () => {
    const url = elWebhookEndpointUrl.textContent;
    navigator.clipboard.writeText(url).then(() => {
      elBtnCopyWebhookUrl.textContent = 'Copied!';
      setTimeout(() => {
        elBtnCopyWebhookUrl.textContent = 'Copy';
      }, 1500);
    });
  });

  // Sync Local Server Verify Token
  elBtnSaveLocalToken.addEventListener('click', async () => {
    const verifyToken = elLocalVerifyToken.value.trim();
    if (!verifyToken) {
      alert('Please enter a verification token.');
      return;
    }

    elBtnSaveLocalToken.disabled = true;
    elBtnSaveLocalToken.textContent = 'Syncing...';

    try {
      const response = await fetch('/api/webhook/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ verifyToken })
      });
      const result = await response.json();
      if (result.success) {
        elBtnSaveLocalToken.textContent = 'Synced!';
        elBtnSaveLocalToken.style.backgroundColor = 'var(--color-success)';
        setTimeout(() => {
          elBtnSaveLocalToken.textContent = 'Sync';
          elBtnSaveLocalToken.style.backgroundColor = '';
        }, 1500);
      } else {
        alert('Failed to update verify token on server.');
      }
    } catch (e) {
      console.error(e);
      alert('Network error trying to sync verify token.');
    } finally {
      elBtnSaveLocalToken.disabled = false;
    }
  });

  // Sidebar Tab Switching
  function switchSidebarTab(tabId) {
    activeSidebarTab = tabId;
    
    if (tabId === 'history') {
      elTabHistory.classList.add('active');
      elTabWebhooks.classList.remove('active');
      elSectionHistory.classList.remove('hidden');
      elSectionWebhooks.classList.add('hidden');
    } else {
      elTabHistory.classList.remove('active');
      elTabWebhooks.classList.add('active');
      elSectionHistory.classList.add('hidden');
      elSectionWebhooks.classList.remove('hidden');
      
      // Hide badge count on selection
      elWebhookBadge.classList.add('hidden');
      lastSeenWebhookCount = totalWebhookCount;
    }
  }

  elTabHistory.addEventListener('click', () => switchSidebarTab('history'));
  elTabWebhooks.addEventListener('click', () => switchSidebarTab('webhooks'));

  // Clear received webhooks log
  elBtnClearWebhooks.addEventListener('click', async () => {
    if (confirm('Are you sure you want to clear received webhooks?')) {
      try {
        const response = await fetch('/api/webhooks/clear', { method: 'POST' });
        if (response.ok) {
          webhooksList = [];
          totalWebhookCount = 0;
          lastSeenWebhookCount = 0;
          elWebhookBadge.classList.add('hidden');
          renderWebhooks();
        }
      } catch (e) {
        console.error('Failed to clear webhooks', e);
      }
    }
  });

  // Fetch Received Webhooks from Server
  async function fetchReceivedWebhooks() {
    try {
      const response = await fetch('/api/webhooks');
      if (!response.ok) return;
      const webhooks = await response.json();
      
      // Check if we received new webhooks
      if (webhooks.length !== webhooksList.length) {
        webhooksList = webhooks;
        totalWebhookCount = webhooksList.length;

        // Render received list
        renderWebhooks();

        // Update badge if Webhooks tab is not active
        if (activeSidebarTab !== 'webhooks') {
          const diff = totalWebhookCount - lastSeenWebhookCount;
          if (diff > 0) {
            elWebhookBadge.textContent = diff;
            elWebhookBadge.classList.remove('hidden');
          }
        } else {
          lastSeenWebhookCount = totalWebhookCount;
        }
      }
    } catch (e) {
      console.warn('Error fetching webhooks:', e);
    }
  }

  // Render Webhooks Feed
  function renderWebhooks() {
    if (webhooksList.length === 0) {
      elWebhookItemsContainer.innerHTML = `
        <div class="history-placeholder">
          <p>Listening for webhooks...</p>
          <p class="muted-subtext">Configure your Meta App Webhook URL to point to this server to capture webhook event payloads.</p>
        </div>
      `;
      return;
    }

    elWebhookItemsContainer.innerHTML = webhooksList.map(webhook => {
      const formattedTime = new Date(webhook.timestamp).toLocaleTimeString();
      
      // Determine what type of webhook event it is
      let eventTypeLabel = 'EVENT';
      let eventSummary = 'Webhook notification';
      let badgeClass = '';

      if (webhook.body) {
        const entry = webhook.body.entry?.[0];
        const change = entry?.changes?.[0];
        const val = change?.value;
        
        if (val) {
          if (val.statuses?.[0]) {
            eventTypeLabel = 'STATUS';
            badgeClass = 'status-update';
            const status = val.statuses[0];
            eventSummary = `Msg ID ending in ...${status.id.substr(-6)}: status ${status.status}`;
          } else if (val.messages?.[0]) {
            eventTypeLabel = 'MSG';
            badgeClass = 'incoming-msg';
            const msg = val.messages[0];
            const sender = msg.from;
            const msgType = msg.type;
            const textBody = msg.text?.body || '';
            eventSummary = `From ${sender}: ${msgType} "${textBody.substr(0, 15)}${textBody.length > 15 ? '...' : ''}"`;
          } else if (change.field) {
            eventSummary = `Field: ${change.field}`;
          }
        } else if (webhook.body.object) {
          eventSummary = `Obj: ${webhook.body.object}`;
        }
      }

      return `
        <div class="webhook-item" data-id="${webhook.id}">
          <div class="webhook-item-header">
            <div class="webhook-item-meta">
              <div class="webhook-item-title">
                <span class="webhook-event-badge ${badgeClass}">${eventTypeLabel}</span>
                <span class="webhook-item-time">${formattedTime}</span>
              </div>
            </div>
            <div class="webhook-item-summary">${escapeHtml(eventSummary)}</div>
          </div>
          <div class="webhook-item-details">
            <pre class="webhook-json-payload"><code>${escapeHtml(JSON.stringify(webhook.body, null, 2))}</code></pre>
          </div>
        </div>
      `;
    }).join('');

    // Attach click toggle for details accordion
    elWebhookItemsContainer.querySelectorAll('.webhook-item-header').forEach(el => {
      el.addEventListener('click', () => {
        const parent = el.closest('.webhook-item');
        parent.classList.toggle('expanded');
      });
    });
  }

  // Start polling when loaded
  function startWebhookPolling() {
    initWebhookUrl();
    if (webhookPollInterval) clearInterval(webhookPollInterval);
    // Poll every 3 seconds
    webhookPollInterval = setInterval(fetchReceivedWebhooks, 3000);
    fetchReceivedWebhooks();
  }

  function stopWebhookPolling() {
    if (webhookPollInterval) {
      clearInterval(webhookPollInterval);
      webhookPollInterval = null;
    }
  }

  // ==========================================================================
  // APP INITIALIZATION
  // ==========================================================================
  checkAuthState();
});
