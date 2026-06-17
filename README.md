<div align="center">

# 🛰️ Grant Radar

<img src="https://img.shields.io/badge/Status-LIVE-00704a?style=for-the-badge&labelColor=2d2118&color=1e9b6e"/>
<img src="https://img.shields.io/badge/AI-OpenRouter-d4a574?style=for-the-badge&labelColor=2d2118"/>
<img src="https://img.shields.io/badge/Updates-Daily-9c6b3a?style=for-the-badge&labelColor=2d2118"/>
<img src="https://img.shields.io/badge/License-MIT-f5f0e6?style=for-the-badge&labelColor=2d2118"/>

### Daily AI-powered digest of open grants, hackathons & bounty programs for developers

[🌐 Live Site](https://grant-radar-black.vercel.app) · [📋 Reports](./reports/) · [⚙️ Workflow](./.github/workflows/daily-report.yml)

</div>

---

## ✨ What is this?

**Grant Radar** is a fully autonomous AI bot that runs on GitHub Actions — no servers, no maintenance, no manual work.

Every day it:
1. 🔍 Scans **40+ active GitHub signals** across grant, hackathon, and bounty topics
2. 🤖 Sends data to **OpenRouter AI** for analysis
3. 📝 Generates a sharp **opportunity digest report**
4. 📊 Updates **activity charts** with signal data
5. 💾 Commits everything automatically to this repo

---

## 📊 What's in each report?

| Section | Description |
|---------|-------------|
| 📡 Today's Signal | Overall activity level in grants/hackathons right now |
| 💰 Top Opportunities | Most promising signals worth a developer's attention |
| 🏆 Hackathon Pulse | Notable hackathon-related activity |
| 📊 Funding Categories Trending | What types of projects are getting attention |
| 🧠 Builder Tip | One sharp, actionable tip for applying today |
| 📈 Activity Chart | ASCII bar chart of top signals |

---

## 🏗️ How it works

```
GitHub Actions (cron: 8:00 + 9:00 UTC)
        │
        ▼
   bot.js runs
        │
        ├── Fetches grant/hackathon/bounty signals
        │   (GitHub topics as activity proxies)
        │
        ├── Sends to OpenRouter AI (openrouter/auto)
        │   for analysis and report generation
        │
        ├── Saves report-YYYY-MM-DD.md
        ├── Updates history.json
        └── Updates stats.json
             │
             ▼
      git commit & push
      (viktoriavikulya)
```

---

## 🗂️ Repository Structure

```
grant-radar/
├── 📄 bot.js                    # Main AI bot
├── 📄 index.html                # Web dashboard
├── 📄 logo.svg                  # Project logo
├── 📄 package.json              # Dependencies
├── 📁 reports/
│   ├── 📄 report-YYYY-MM-DD.md  # Daily reports
│   ├── 📄 history.json          # Reports archive
│   └── 📄 stats.json            # Signal data for charts
└── 📁 .github/workflows/
    └── 📄 daily-report.yml      # Automation config
```

---

## ⚙️ Tech Stack

<div align="center">

| Layer | Technology |
|-------|-----------|
| 🤖 AI | OpenRouter (auto model selection) |
| ⚡ Runtime | Node.js 22 |
| 🔄 Automation | GitHub Actions |
| 🌐 Frontend | Vanilla HTML + Chart.js |
| 🚀 Hosting | Vercel |
| 📡 Data | GitHub REST API |

</div>

---

## 🚀 Self-Hosted Setup

1. Fork this repo
2. Add secrets in `Settings → Secrets → Actions`:
   - `OPENAI_API_KEY` — your OpenRouter key
   - `GH_PAT` — GitHub token with `repo` + `workflow`
   - `TALENT_WALLET` — your Base wallet address
3. Go to `Actions` → `Daily Grant Radar` → `Run workflow`
4. Done — bot runs itself every day ✅

---

## 📈 Contribution Activity

> The bot commits every report automatically — watch the contribution graph grow! 🟩

---

<div align="center">

**Built by [viktoriavikulya](https://github.com/viktoriavikulya) · Powered by OpenRouter AI · Runs on GitHub Actions**

⭐ Star this repo if you find it useful!

</div>
