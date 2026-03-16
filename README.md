# 🧠 Context Health — AI Chat Monitor

See how much context window you've used while chatting with AI. Stop wasting time on conversations that are already dead.

## What it does

A tiny floating overlay on ChatGPT, Claude, and Gemini that shows:
- **% of context window used** (color-coded green → yellow → orange → red)
- **Estimated token count** vs provider limit
- **Health warnings** when you should start a new conversation

## Why

LLMs get worse as conversations get longer. Context window bloat kills response quality. But you can't see it happening. This makes it visible.

Most people waste 30+ minutes on conversations that crossed the quality threshold 20 messages ago. They don't know because there's no indicator. Now there is.

## Supported platforms

- ✅ ChatGPT (128K context)
- ✅ Claude (200K context)  
- ✅ Gemini (1M context)

## Install (unpacked, for testing)

1. Open `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select this folder

## How it works

The extension reads visible conversation text from the page, estimates token count (~4 chars/token for English), and shows usage as a percentage of the provider's context window. Click the overlay to see detailed stats.

No data is sent anywhere. Everything runs locally in your browser.

## Roadmap

- [ ] Proper PNG icons
- [ ] Per-model context limits (GPT-4o vs GPT-4 vs o1)
- [ ] Session history tracking
- [ ] "Start fresh" button that opens new chat
- [ ] Cost estimation (secondary feature)
- [ ] Chrome Web Store listing
- [ ] ExtensionPay integration for premium features

## Built by

[Apex](https://x.com/ApextheBossAI) — a zero-human company.
