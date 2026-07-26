"use strict";

const { stats } = require("../middleware/stats");
const os = require("os");

// ─── Favicon (KKIT red "K" as inline SVG → base64 data URL) ──────────────────
const FAVICON_SVG = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#dc2626"/>
  <text x="16" y="23" font-family="Arial Black,sans-serif" font-size="20"
        font-weight="900" fill="white" text-anchor="middle">K</text>
</svg>`).toString("base64");

const FAVICON_URI = `data:image/svg+xml;base64,${FAVICON_SVG}`;

// ─── API route list ───────────────────────────────────────────────────────────
const API_ROUTES = [
  { method: "POST",   path: "/api/v1/auth/login",          desc: "User login" },
  { method: "POST",   path: "/api/v1/auth/register",       desc: "Register user" },
  { method: "GET",    path: "/api/v1/users",               desc: "List users" },
  { method: "GET",    path: "/api/v1/courses",             desc: "List courses" },
  { method: "GET",    path: "/api/v1/blogs",               desc: "List blogs" },
  { method: "GET",    path: "/api/v1/services",            desc: "List services" },
  { method: "GET",    path: "/api/v1/portfolio",           desc: "Portfolio items" },
  { method: "GET",    path: "/api/v1/team",                desc: "Team members" },
  { method: "GET",    path: "/api/v1/pricing",             desc: "Pricing plans" },
  { method: "GET",    path: "/api/v1/faqs",                desc: "FAQ list" },
  { method: "GET",    path: "/api/v1/testimonials",        desc: "Testimonials" },
  { method: "GET",    path: "/api/v1/reviews",             desc: "Reviews" },
  { method: "POST",   path: "/api/v1/payments",            desc: "Initiate payment" },
  { method: "GET",    path: "/api/v1/enrollments",         desc: "Enrollments" },
  { method: "GET",    path: "/api/v1/certificates",        desc: "Certificates" },
  { method: "GET",    path: "/api/v1/dashboard",           desc: "Dashboard stats" },
  { method: "GET",    path: "/api/v1/admin",               desc: "Admin panel data" },
  { method: "POST",   path: "/api/v1/contact",             desc: "Contact form" },
  { method: "POST",   path: "/api/v1/newsletter",          desc: "Newsletter subscribe" },
  { method: "GET",    path: "/health",                     desc: "Health check" },
];

function uptime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ${h % 24}h ${m % 60}m`;
  if (h > 0) return `${h}h ${m % 60}m ${s % 60}s`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

function methodBadge(method) {
  const colors = { GET:"#22c55e", POST:"#3b82f6", PUT:"#f59e0b", PATCH:"#8b5cf6", DELETE:"#ef4444" };
  const c = colors[method] || "#6b7280";
  return `<span style="background:${c};color:#fff;padding:2px 7px;border-radius:4px;font-size:11px;font-weight:700;font-family:monospace">${method}</span>`;
}

function statusBadge(code) {
  const c = code >= 500 ? "#ef4444" : code >= 400 ? "#f59e0b" : code >= 300 ? "#06b6d4" : "#22c55e";
  return `<span style="background:${c}22;color:${c};border:1px solid ${c}44;padding:1px 6px;border-radius:4px;font-size:11px;font-weight:700">${code}</span>`;
}

function renderDashboard(req, res) {
  const now     = Date.now();
  const uptimeMs= now - stats.startTime;
  const mem     = process.memoryUsage();
  const freeMem = os.freemem();
  const totMem  = os.totalmem();
  const memPct  = ((1 - freeMem / totMem) * 100).toFixed(1);
  const cpuLoad = os.loadavg()[0].toFixed(2);

  const recentRows = stats.recentReqs.slice(0, 20).map(r => `
    <tr>
      <td>${methodBadge(r.method)}</td>
      <td style="font-family:monospace;font-size:12px;color:#a1a1aa">${r.path}</td>
      <td>${statusBadge(r.status)}</td>
      <td style="color:#71717a;font-size:12px">${r.ms}ms</td>
      <td style="color:#71717a;font-size:12px">${r.ip}</td>
      <td style="color:#52525b;font-size:11px">${new Date(r.time).toLocaleTimeString()}</td>
    </tr>`).join("") || `<tr><td colspan="6" style="text-align:center;color:#52525b;padding:20px">No requests yet</td></tr>`;

  const attackRows = stats.attacks.slice(0, 10).map(a => `
    <tr>
      <td><span style="background:#ef444422;color:#ef4444;border:1px solid #ef444444;padding:2px 7px;border-radius:4px;font-size:11px;font-weight:700">⚠ ${a.type}</span></td>
      <td style="font-family:monospace;font-size:12px;color:#a1a1aa">${a.method} ${a.path}</td>
      <td style="color:#71717a;font-size:12px">${a.ip}</td>
      <td style="color:#52525b;font-size:11px">${new Date(a.time).toLocaleTimeString()}</td>
    </tr>`).join("") || `<tr><td colspan="4" style="text-align:center;color:#22c55e;padding:20px">✓ No attacks detected</td></tr>`;

  const errorRows = stats.errors.slice(0, 10).map(e => `
    <tr>
      <td>${statusBadge(e.status)}</td>
      <td style="font-family:monospace;font-size:12px;color:#a1a1aa">${e.method} ${e.path}</td>
      <td style="color:#71717a;font-size:12px">${e.ms}ms</td>
      <td style="color:#52525b;font-size:11px">${new Date(e.time).toLocaleTimeString()}</td>
    </tr>`).join("") || `<tr><td colspan="4" style="text-align:center;color:#22c55e;padding:20px">✓ No server errors</td></tr>`;

  const routeRows = API_ROUTES.map(r => `
    <tr>
      <td>${methodBadge(r.method)}</td>
      <td style="font-family:monospace;font-size:12px;color:#a1a1aa">${r.path}</td>
      <td style="color:#71717a;font-size:12px">${r.desc}</td>
    </tr>`).join("");

  const successCount = Object.entries(stats.statusCounts).filter(([k])=>+k<400).reduce((a,[,v])=>a+v,0);
  const clientErrCount = Object.entries(stats.statusCounts).filter(([k])=>+k>=400&&+k<500).reduce((a,[,v])=>a+v,0);
  const serverErrCount = Object.entries(stats.statusCounts).filter(([k])=>+k>=500).reduce((a,[,v])=>a+v,0);

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>KKIT API Server — Dashboard</title>
<link rel="icon" type="image/svg+xml" href="${FAVICON_URI}"/>
<meta http-equiv="refresh" content="10"/>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  :root{
    --bg:#09090b;--bg2:#0f0f12;--bg3:#18181b;
    --border:#27272a;--border2:#3f3f46;
    --red:#dc2626;--red2:#ef4444;
    --green:#22c55e;--yellow:#f59e0b;--blue:#3b82f6;
    --text:#fafafa;--muted:#a1a1aa;--dim:#52525b;
  }
  html,body{background:var(--bg);color:var(--text);font-family:'Inter',sans-serif;font-size:14px;min-height:100vh}
  a{color:var(--red2);text-decoration:none}a:hover{text-decoration:underline}

  /* ─── Header ─── */
  header{
    background:linear-gradient(135deg,#0f0f12 0%,#18080a 100%);
    border-bottom:1px solid var(--border);
    padding:20px 32px;
    display:flex;align-items:center;justify-content:space-between;
    position:sticky;top:0;z-index:100;
    backdrop-filter:blur(12px);
  }
  .logo{display:flex;align-items:center;gap:12px}
  .logo-icon{
    width:40px;height:40px;background:var(--red);border-radius:10px;
    display:flex;align-items:center;justify-content:center;
    font-weight:900;font-size:20px;letter-spacing:-1px;
    box-shadow:0 0 20px rgba(220,38,38,0.4);
  }
  .logo-text{font-size:18px;font-weight:700;letter-spacing:-0.5px}
  .logo-sub{font-size:11px;color:var(--muted);margin-top:1px}
  .header-right{display:flex;align-items:center;gap:16px}
  .status-pill{
    display:flex;align-items:center;gap:6px;
    background:#0a2010;border:1px solid #166534;
    padding:6px 14px;border-radius:99px;font-size:12px;font-weight:600;color:#22c55e;
  }
  .pulse{
    width:8px;height:8px;background:#22c55e;border-radius:50%;
    animation:pulse 1.5s ease-in-out infinite;
  }
  @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.5)}50%{box-shadow:0 0 0 6px rgba(34,197,94,0)}}
  .refresh-note{font-size:11px;color:var(--dim)}

  /* ─── Layout ─── */
  main{max-width:1400px;margin:0 auto;padding:28px 24px}

  /* ─── Stat cards ─── */
  .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:28px}
  .card{
    background:var(--bg2);border:1px solid var(--border);border-radius:14px;
    padding:20px;transition:border-color .2s;
  }
  .card:hover{border-color:var(--border2)}
  .card-label{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;font-weight:600;margin-bottom:8px}
  .card-value{font-size:28px;font-weight:700;line-height:1;font-family:'JetBrains Mono',monospace}
  .card-sub{font-size:11px;color:var(--dim);margin-top:4px}
  .accent-red{color:var(--red2)}
  .accent-green{color:var(--green)}
  .accent-yellow{color:var(--yellow)}
  .accent-blue{color:var(--blue)}

  /* ─── Section ─── */
  .section{background:var(--bg2);border:1px solid var(--border);border-radius:14px;margin-bottom:20px;overflow:hidden}
  .section-header{
    padding:16px 20px;border-bottom:1px solid var(--border);
    display:flex;align-items:center;justify-content:space-between;
  }
  .section-title{font-size:13px;font-weight:600;display:flex;align-items:center;gap:8px}
  .section-badge{
    font-size:11px;padding:2px 8px;border-radius:99px;
    background:var(--bg3);border:1px solid var(--border2);color:var(--muted);
  }
  .attack-badge{background:#450a0a;border-color:#7f1d1d;color:#fca5a5}

  /* ─── Tables ─── */
  table{width:100%;border-collapse:collapse}
  th{padding:10px 16px;font-size:11px;text-transform:uppercase;letter-spacing:.06em;
     color:var(--dim);font-weight:600;text-align:left;background:var(--bg3);border-bottom:1px solid var(--border)}
  td{padding:10px 16px;border-bottom:1px solid #18181b;vertical-align:middle}
  tr:last-child td{border-bottom:none}
  tbody tr:hover{background:rgba(255,255,255,0.02)}

  /* ─── Progress bar ─── */
  .progress-wrap{background:var(--bg3);border-radius:99px;height:6px;overflow:hidden;margin-top:6px}
  .progress-bar{height:100%;border-radius:99px;transition:width .4s}

  /* ─── Nav pills ─── */
  .nav-pills{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px}
  .pill{
    padding:8px 16px;border-radius:99px;font-size:13px;font-weight:500;
    background:var(--bg3);border:1px solid var(--border);cursor:pointer;
    transition:all .15s;text-decoration:none;color:var(--text);
    display:flex;align-items:center;gap:6px;
  }
  .pill:hover,.pill.active{background:var(--red);border-color:var(--red);color:#fff;box-shadow:0 0 12px rgba(220,38,38,0.3);text-decoration:none}

  /* ─── Two columns ─── */
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:20px}
  @media(max-width:900px){.grid2{grid-template-columns:1fr}}

  /* ─── Attack warning banner ─── */
  .attack-banner{
    background:#450a0a;border:1px solid #7f1d1d;border-radius:10px;
    padding:12px 16px;margin-bottom:20px;display:flex;align-items:center;gap:10px;
    font-size:13px;color:#fca5a5;
  }
  .attack-banner .icon{font-size:18px}
</style>
</head>
<body>

<header>
  <div class="logo">
    <div class="logo-icon">K</div>
    <div>
      <div class="logo-text">KKIT API Server</div>
      <div class="logo-sub">Premium Digital Solutions & Learning Platform</div>
    </div>
  </div>
  <div class="header-right">
    <span class="status-pill"><span class="pulse"></span>ONLINE</span>
    <span class="refresh-note">⟳ Auto-refresh 10s</span>
  </div>
</header>

<main>

  ${stats.attacks.length > 0 ? `
  <div class="attack-banner">
    <span class="icon">🚨</span>
    <strong>${stats.attacks.length} suspicious request${stats.attacks.length > 1 ? "s" : ""} detected</strong>
    — Check the Attack Log below for details.
  </div>` : ""}

  <!-- Quick nav -->
  <div class="nav-pills">
    <a class="pill active" href="/">🏠 Dashboard</a>
    <a class="pill" href="/health">❤️ Health Check</a>
    <a class="pill" href="/api/v1/courses">📚 Courses</a>
    <a class="pill" href="/api/v1/blogs">📝 Blogs</a>
    <a class="pill" href="/api/v1/services">⚡ Services</a>
    <a class="pill" href="/api/v1/pricing">💰 Pricing</a>
    <a class="pill" href="/api/v1/team">👥 Team</a>
    <a class="pill" href="/api/v1/faqs">❓ FAQs</a>
  </div>

  <!-- Stat cards -->
  <div class="cards">
    <div class="card">
      <div class="card-label">Total Requests</div>
      <div class="card-value accent-blue">${stats.totalReqs.toLocaleString()}</div>
      <div class="card-sub">Since server start</div>
    </div>
    <div class="card">
      <div class="card-label">Active Now</div>
      <div class="card-value accent-green">${stats.activeReqs}</div>
      <div class="card-sub">In-flight requests</div>
    </div>
    <div class="card">
      <div class="card-label">Success (2xx)</div>
      <div class="card-value accent-green">${successCount}</div>
      <div class="card-sub">OK responses</div>
    </div>
    <div class="card">
      <div class="card-label">Client Errors</div>
      <div class="card-value accent-yellow">${clientErrCount}</div>
      <div class="card-sub">4xx responses</div>
    </div>
    <div class="card">
      <div class="card-label">Server Errors</div>
      <div class="card-value accent-red">${serverErrCount}</div>
      <div class="card-sub">5xx responses</div>
    </div>
    <div class="card">
      <div class="card-label">Attacks</div>
      <div class="card-value accent-red">${stats.attacks.length}</div>
      <div class="card-sub">Suspicious requests</div>
    </div>
    <div class="card">
      <div class="card-label">Uptime</div>
      <div class="card-value" style="font-size:20px">${uptime(uptimeMs)}</div>
      <div class="card-sub">Server running time</div>
    </div>
    <div class="card">
      <div class="card-label">Memory Usage</div>
      <div class="card-value" style="font-size:22px;color:${parseFloat(memPct)>80?"#ef4444":"#f59e0b"}">${memPct}%</div>
      <div class="progress-wrap"><div class="progress-bar" style="width:${memPct}%;background:${parseFloat(memPct)>80?"#ef4444":"#f59e0b"}"></div></div>
      <div class="card-sub">${(mem.heapUsed/1024/1024).toFixed(0)}MB heap used</div>
    </div>
    <div class="card">
      <div class="card-label">CPU Load</div>
      <div class="card-value" style="font-size:22px">${cpuLoad}</div>
      <div class="card-sub">1-min avg load</div>
    </div>
  </div>

  <!-- Recent Requests + Attacks (side by side) -->
  <div class="grid2">
    <div class="section">
      <div class="section-header">
        <div class="section-title">📋 Recent Requests <span class="section-badge">last 20</span></div>
      </div>
      <table>
        <thead><tr><th>Method</th><th>Path</th><th>Status</th><th>Time</th><th>IP</th><th>At</th></tr></thead>
        <tbody>${recentRows}</tbody>
      </table>
    </div>

    <div>
      <div class="section" style="margin-bottom:20px">
        <div class="section-header">
          <div class="section-title">🚨 Attack Log <span class="section-badge attack-badge">${stats.attacks.length} detected</span></div>
        </div>
        <table>
          <thead><tr><th>Type</th><th>Request</th><th>IP</th><th>At</th></tr></thead>
          <tbody>${attackRows}</tbody>
        </table>
      </div>
      <div class="section">
        <div class="section-header">
          <div class="section-title">🔴 Server Errors <span class="section-badge">${stats.errors.length} total</span></div>
        </div>
        <table>
          <thead><tr><th>Status</th><th>Request</th><th>Time</th><th>At</th></tr></thead>
          <tbody>${errorRows}</tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- API Routes -->
  <div class="section">
    <div class="section-header">
      <div class="section-title">🗺️ API Routes <span class="section-badge">${API_ROUTES.length} endpoints</span></div>
    </div>
    <table>
      <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>
      <tbody>${routeRows}</tbody>
    </table>
  </div>

</main>
</body>
</html>`);
}

module.exports = renderDashboard;