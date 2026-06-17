const fetch = require("node-fetch");
const fs = require("fs");

const OPENROUTER_API_KEY = process.env.OPENAI_API_KEY;
const WALLET = process.env.TALENT_WALLET || "unknown";

// Sources we pull signals from (GitHub topics act as proxies for active
// grant/hackathon programs since most publish their repos publicly)
const SEARCH_TOPICS = [
  "hackathon", "grant", "bounty", "gitcoin", "web3-grant",
  "devpost", "open-source-grant", "ethereum-grant", "ai-grant", "hackathon-2026"
];

async function fetchGrantSignals(topic) {
  const url = `https://api.github.com/search/repositories?q=topic:${topic}+pushed:>2025-01-01&sort=updated&order=desc&per_page=4`;
  const res = await fetch(url, {
    headers: { "Accept": "application/vnd.github.v3+json" }
  });
  const data = await res.json();
  return (data.items || []).map(r => ({
    name: r.full_name,
    stars: r.stargazers_count,
    description: r.description || "No description",
    url: r.html_url,
    topic,
    updated: r.pushed_at
  }));
}

async function generateReport(signals) {
  const list = signals.slice(0, 18).map((s, i) =>
    `${i + 1}. [${s.topic}] ${s.name} (⭐${s.stars}) - ${s.description}`
  ).join("\n");

  const today = new Date().toISOString().split("T")[0];

  const prompt = `You are Grant Radar — a daily AI analyst tracking open grants, hackathons, and bounty programs for developers.

Today is ${today}. Below are recently active repositories tagged with grant/hackathon/bounty-related topics on GitHub. Use them as signals of what's currently active in the funding and competition space, and synthesize a sharp, genuinely useful daily digest for developers hunting for opportunities.

SIGNALS:
${list}

Write a report with these exact sections:

## 🛰️ Grant Radar — ${today}

### 📡 Today's Signal
(2-3 sentences: what's the overall activity level in grants/hackathons right now)

### 💰 Top Opportunities to Watch
(pick 3-5 most promising signals, explain what kind of program/grant they likely represent and why a developer should look into it)

### 🏆 Hackathon Pulse
(any hackathon-related activity worth noting)

### 📊 Funding Categories Trending
(what types of projects seem to be getting attention: AI, DeFi, infra, tooling, etc.)

### 🧠 Builder Tip
(one sharp, actionable tip for someone applying to grants/hackathons today)

### 📈 Activity Chart
(ASCII bar chart of top 5 signals by stars, max bar = 20 chars)

Keep it sharp, useful, under 600 words. No fluff. Be honest that these are signals/proxies, not a guaranteed exhaustive list of every grant.`;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://github.com/viktoriavikulya/grant-radar",
      "X-Title": "Grant Radar"
    },
    body: JSON.stringify({
      model: "openrouter/auto",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await res.json();
  if (!data.choices || !data.choices[0]) {
    throw new Error("OpenRouter error: " + JSON.stringify(data));
  }
  return data.choices[0].message.content;
}

async function loadHistory() {
  const historyFile = "reports/history.json";
  if (fs.existsSync(historyFile)) {
    return JSON.parse(fs.readFileSync(historyFile, "utf8"));
  }
  return [];
}

async function saveHistory(history) {
  fs.writeFileSync("reports/history.json", JSON.stringify(history, null, 2));
}

async function main() {
  console.log("🛰️ Grant Radar starting...");

  let allSignals = [];
  for (const topic of SEARCH_TOPICS) {
    try {
      const signals = await fetchGrantSignals(topic);
      allSignals = allSignals.concat(signals);
      await new Promise(r => setTimeout(r, 500));
    } catch (e) {
      console.log(`Skip topic ${topic}: ${e.message}`);
    }
  }

  const seen = new Set();
  allSignals = allSignals.filter(s => {
    if (seen.has(s.name)) return false;
    seen.add(s.name);
    return true;
  });

  allSignals.sort((a, b) => b.stars - a.stars);
  console.log(`✅ Fetched ${allSignals.length} unique signals`);

  const report = await generateReport(allSignals);
  console.log("✅ AI report generated");

  const today = new Date().toISOString().split("T")[0];
  const timestamp = new Date().toISOString();

  if (!fs.existsSync("reports")) fs.mkdirSync("reports");
  const reportPath = `reports/report-${today}.md`;
  fs.writeFileSync(reportPath, report);
  console.log(`✅ Report saved: ${reportPath}`);

  const history = await loadHistory();
  const topSignals = allSignals.slice(0, 5).map(s => ({
    name: s.name,
    stars: s.stars,
    topic: s.topic
  }));

  history.unshift({
    date: today,
    timestamp,
    reportFile: `report-${today}.md`,
    topSignals,
    wallet: WALLET
  });

  const trimmed = history.slice(0, 90);
  await saveHistory(trimmed);
  console.log("✅ History updated");

  const stats = {
    lastUpdated: timestamp,
    totalReports: trimmed.length,
    wallet: WALLET,
    latestDate: today,
    topSignals: allSignals.slice(0, 10).map(s => ({
      name: s.name.split("/")[1],
      stars: s.stars,
      topic: s.topic
    }))
  };
  fs.writeFileSync("reports/stats.json", JSON.stringify(stats, null, 2));
  console.log("✅ Stats saved");
  console.log("🚀 Grant Radar complete!");
}

main().catch(e => {
  console.error("❌ Error:", e);
  process.exit(1);
});
