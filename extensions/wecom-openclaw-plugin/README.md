# 🤖 WeCom OpenClaw Plugin

**WeCom channel plugin for [OpenClaw](https://github.com/openclaw).**

> A smart bot built on persistent connections — supports passive multi-message replies and proactive messaging to users.

---

## ✨ Features

- 🔗 Ai chatbot based on WebSocket connection
- 💬 Supports passive replies with multiple messages
- 📤 Supports proactive messaging to users

---

## 🚀 Getting Started

### Installation

```shell
# Install the WeCom Channel Plugin
openclaw plugins install @wecom/wecom-openclaw-plugin

# Future plugin updates
openclaw plugins update wecom-openclaw-plugin
```

### Configuration

#### Option 1: Interactive Setup

```shell
openclaw channels add
```

#### Option 2: Minimal Configuration

```shell
openclaw config set channels.wecom.botId <YOUR_BOT_ID> && openclaw config set channels.wecom.secret <YOUR_BOT_SECRET> && openclaw config set channels.wecom.enabled true && openclaw gateway restart
```

## 📄 License

MIT
