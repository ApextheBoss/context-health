// Context Health — AI Chat Monitor
// Tracks token usage in real-time while using ChatGPT, Claude, or Gemini

(function() {
  'use strict';

  // Context window sizes by provider (in tokens)
  const CONTEXT_LIMITS = {
    'chatgpt.com':      { name: 'ChatGPT',  limit: 128000 },
    'chat.openai.com':  { name: 'ChatGPT',  limit: 128000 },
    'claude.ai':        { name: 'Claude',    limit: 200000 },
    'gemini.google.com':{ name: 'Gemini',    limit: 1000000 },
  };

  // Rough token estimation: ~4 chars per token for English
  const CHARS_PER_TOKEN = 4;

  function getProvider() {
    const host = window.location.hostname;
    return CONTEXT_LIMITS[host] || null;
  }

  function estimateTokens(text) {
    if (!text) return 0;
    return Math.ceil(text.length / CHARS_PER_TOKEN);
  }

  function getConversationText() {
    const provider = getProvider();
    if (!provider) return '';

    // Different selectors for different platforms
    const selectors = [
      // ChatGPT
      '[data-message-author-role]',
      '.markdown',
      // Claude
      '.font-claude-message',
      '[class*="Message"]',
      '.prose',
      // Gemini
      '.model-response-text',
      '.query-text',
      // Generic fallback
      '[role="presentation"]',
    ];

    let allText = '';
    for (const sel of selectors) {
      const elements = document.querySelectorAll(sel);
      if (elements.length > 0) {
        elements.forEach(el => {
          allText += el.textContent + '\n';
        });
        break; // Use first matching selector set
      }
    }

    // Fallback: grab main content area
    if (!allText) {
      const main = document.querySelector('main') || document.querySelector('[role="main"]');
      if (main) allText = main.textContent;
    }

    return allText;
  }

  function getHealthColor(pct) {
    if (pct < 50) return '#22c55e'; // green
    if (pct < 75) return '#eab308'; // yellow
    if (pct < 90) return '#f97316'; // orange
    return '#ef4444'; // red
  }

  function getHealthLabel(pct) {
    if (pct < 50) return 'Healthy';
    if (pct < 75) return 'Getting Long';
    if (pct < 90) return 'Start Fresh Soon';
    return 'Context Exhausted';
  }

  // Create the floating overlay
  function createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'context-health-overlay';
    overlay.innerHTML = `
      <div id="ch-bar-container">
        <div id="ch-bar-fill"></div>
      </div>
      <div id="ch-info">
        <span id="ch-pct">0%</span>
        <span id="ch-label">Healthy</span>
      </div>
      <div id="ch-details" style="display:none;">
        <div id="ch-tokens">0 / 0 tokens</div>
        <div id="ch-provider"></div>
        <div id="ch-tip"></div>
      </div>
    `;

    // Toggle details on click
    overlay.addEventListener('click', () => {
      const details = overlay.querySelector('#ch-details');
      details.style.display = details.style.display === 'none' ? 'block' : 'none';
    });

    document.body.appendChild(overlay);
    return overlay;
  }

  function updateOverlay() {
    const provider = getProvider();
    if (!provider) return;

    const text = getConversationText();
    const tokens = estimateTokens(text);
    const pct = Math.min(100, Math.round((tokens / provider.limit) * 100));
    const color = getHealthColor(pct);
    const label = getHealthLabel(pct);

    const overlay = document.getElementById('context-health-overlay');
    if (!overlay) return;

    const barFill = overlay.querySelector('#ch-bar-fill');
    const pctEl = overlay.querySelector('#ch-pct');
    const labelEl = overlay.querySelector('#ch-label');
    const tokensEl = overlay.querySelector('#ch-tokens');
    const providerEl = overlay.querySelector('#ch-provider');
    const tipEl = overlay.querySelector('#ch-tip');

    barFill.style.width = pct + '%';
    barFill.style.backgroundColor = color;
    pctEl.textContent = pct + '%';
    pctEl.style.color = color;
    labelEl.textContent = label;
    labelEl.style.color = color;
    tokensEl.textContent = `~${tokens.toLocaleString()} / ${provider.limit.toLocaleString()} tokens`;
    providerEl.textContent = provider.name;

    if (pct >= 90) {
      tipEl.textContent = '⚠️ Start a new conversation for better responses';
      tipEl.style.color = '#ef4444';
    } else if (pct >= 75) {
      tipEl.textContent = '💡 Consider starting fresh soon';
      tipEl.style.color = '#eab308';
    } else {
      tipEl.textContent = '';
    }

    // Pulse animation when crossing thresholds
    if (pct >= 75) {
      overlay.classList.add('ch-warning');
    } else {
      overlay.classList.remove('ch-warning');
    }
  }

  // Initialize
  const provider = getProvider();
  if (provider) {
    createOverlay();
    // Update every 2 seconds
    setInterval(updateOverlay, 2000);
    // Also update on DOM changes (new messages)
    const observer = new MutationObserver(() => {
      setTimeout(updateOverlay, 500);
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    // Initial update
    setTimeout(updateOverlay, 1000);
  }
})();
