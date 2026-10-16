const endpoints = [
  // ── Health ──
  { method: "GET", path: "/api/v1/health", auth: false, description: "Server health check — uptime, DB status, memory usage", group: "Health" },
  { method: "GET", path: "/api/v1/docs", auth: false, description: "This API documentation page", group: "Health" },

  // ── Auth ──
  { method: "POST", path: "/api/v1/auth/register", auth: false, description: "Register a new user account", body: ["name", "email", "phone", "password", "role?"], group: "Auth" },
  { method: "POST", path: "/api/v1/auth/login", auth: false, description: "Login with email + password (admin skips OTP)", body: ["email", "password", "fingerprint?"], group: "Auth" },
  { method: "POST", path: "/api/v1/auth/send-otp", auth: false, description: "Send OTP to phone or email", body: ["identifier"], group: "Auth" },
  { method: "POST", path: "/api/v1/auth/verify-otp", auth: false, description: "Verify OTP and complete login", body: ["identifier", "otp", "fingerprint?"], group: "Auth" },
  { method: "POST", path: "/api/v1/auth/logout", auth: false, description: "Logout and clear all cookies", group: "Auth" },
  { method: "GET", path: "/api/v1/auth/me", auth: true, description: "Get current logged-in user profile", group: "Auth" },
  { method: "POST", path: "/api/v1/auth/refresh-token", auth: false, description: "Refresh expired access token", body: ["refreshToken"], group: "Auth" },
  { method: "POST", path: "/api/v1/auth/forgot-password", auth: false, description: "Send password reset email", body: ["email"], group: "Auth" },
  { method: "POST", path: "/api/v1/auth/reset-password", auth: false, description: "Reset password with reset token", body: ["token", "password"], group: "Auth" },

  // ── Users ──
  { method: "GET", path: "/api/v1/users", auth: true, role: "admin", description: "List all users (admin only)", group: "Users" },
  { method: "GET", path: "/api/v1/users/:id", auth: true, description: "Get user by ID", group: "Users" },
  { method: "PUT", path: "/api/v1/users/:id", auth: true, description: "Update user profile", group: "Users" },
  { method: "DELETE", path: "/api/v1/users/:id", auth: true, role: "admin", description: "Delete user (admin only)", group: "Users" },

  // ── Courses ──
  { method: "GET", path: "/api/v1/courses", auth: false, description: "List all courses (public, supports ?category & ?search)", group: "Courses" },
  { method: "GET", path: "/api/v1/courses/:id", auth: false, description: "Get course by ID with full details", group: "Courses" },
  { method: "GET", path: "/api/v1/courses/slug/:slug", auth: false, description: "Get course by URL slug", group: "Courses" },
  { method: "POST", path: "/api/v1/courses", auth: true, role: "admin", description: "Create a new course", group: "Courses" },
  { method: "PUT", path: "/api/v1/courses/:id", auth: true, role: "admin", description: "Update course details", group: "Courses" },
  { method: "DELETE", path: "/api/v1/courses/:id", auth: true, role: "admin", description: "Delete a course", group: "Courses" },

  // ── Categories ──
  { method: "GET", path: "/api/v1/categories", auth: false, description: "List all categories (public)", group: "Categories" },
  { method: "POST", path: "/api/v1/categories", auth: true, role: "admin", description: "Create a new category", body: ["name", "slug?", "description?", "icon?", "color?"], group: "Categories" },
  { method: "PUT", path: "/api/v1/categories/:id", auth: true, role: "admin", description: "Update a category", group: "Categories" },
  { method: "DELETE", path: "/api/v1/categories/:id", auth: true, role: "admin", description: "Delete a category", group: "Categories" },

  // ── Enrollments ──
  { method: "GET", path: "/api/v1/enrollments", auth: true, description: "Get my enrollments", group: "Enrollments" },
  { method: "GET", path: "/api/v1/enrollments/:id", auth: true, description: "Get enrollment detail with module progress", group: "Enrollments" },
  { method: "POST", path: "/api/v1/enrollments/:id/complete-lesson", auth: true, description: "Toggle lesson completion (marks done/undone)", body: ["moduleId", "lessonId"], group: "Enrollments" },

  // ── Payments ──
  { method: "GET", path: "/api/v1/payments", auth: true, role: "admin", description: "List all payments (admin)", group: "Payments" },
  { method: "POST", path: "/api/v1/payments", auth: true, description: "Create a payment (always starts as pending)", body: ["course", "method", "amount", "couponCode?", "billingDetails", "paymentProof?"], group: "Payments" },
  { method: "PUT", path: "/api/v1/payments/:id/confirm", auth: true, role: "admin", description: "Confirm a pending payment", group: "Payments" },
  { method: "PUT", path: "/api/v1/payments/:id/cancel", auth: true, role: "admin", description: "Cancel a pending payment", group: "Payments" },
  { method: "PUT", path: "/api/v1/payments/:id/refund", auth: true, role: "admin", description: "Refund a confirmed payment", group: "Payments" },

  // ── Invoices ──
  { method: "GET", path: "/api/v1/invoices", auth: true, description: "Get my invoices", group: "Invoices" },
  { method: "GET", path: "/api/v1/invoices/:id", auth: true, description: "Get invoice detail", group: "Invoices" },
  { method: "GET", path: "/api/v1/invoices/:id/pdf", auth: true, description: "Download invoice as PDF", group: "Invoices" },

  // ── Blogs ──
  { method: "GET", path: "/api/v1/blogs", auth: false, description: "List all blog posts (public)", group: "Blogs" },
  { method: "GET", path: "/api/v1/blogs/:slug", auth: false, description: "Get blog post by slug", group: "Blogs" },
  { method: "POST", path: "/api/v1/blogs", auth: true, role: "admin", description: "Create a blog post", group: "Blogs" },
  { method: "PUT", path: "/api/v1/blogs/:id", auth: true, role: "admin", description: "Update a blog post", group: "Blogs" },
  { method: "DELETE", path: "/api/v1/blogs/:id", auth: true, role: "admin", description: "Delete a blog post", group: "Blogs" },

  // ── Team ──
  { method: "GET", path: "/api/v1/team", auth: false, description: "List team members (public)", group: "Team" },
  { method: "POST", path: "/api/v1/team", auth: true, role: "admin", description: "Add a team member", group: "Team" },
  { method: "PUT", path: "/api/v1/team/:id", auth: true, role: "admin", description: "Update team member", group: "Team" },
  { method: "DELETE", path: "/api/v1/team/:id", auth: true, role: "admin", description: "Remove team member", group: "Team" },

  // ── Testimonials ──
  { method: "GET", path: "/api/v1/testimonials", auth: false, description: "List testimonials (public)", group: "Testimonials" },
  { method: "POST", path: "/api/v1/testimonials", auth: true, role: "admin", description: "Add testimonial", group: "Testimonials" },
  { method: "PUT", path: "/api/v1/testimonials/:id", auth: true, role: "admin", description: "Update testimonial", group: "Testimonials" },
  { method: "DELETE", path: "/api/v1/testimonials/:id", auth: true, role: "admin", description: "Delete testimonial", group: "Testimonials" },

  // ── Pricing ──
  { method: "GET", path: "/api/v1/pricing", auth: false, description: "List pricing plans (public)", group: "Pricing" },
  { method: "POST", path: "/api/v1/pricing", auth: true, role: "admin", description: "Create a pricing plan", group: "Pricing" },
  { method: "PUT", path: "/api/v1/pricing/:id", auth: true, role: "admin", description: "Update pricing plan", group: "Pricing" },
  { method: "DELETE", path: "/api/v1/pricing/:id", auth: true, role: "admin", description: "Delete pricing plan", group: "Pricing" },

  // ── Services ──
  { method: "GET", path: "/api/v1/services", auth: false, description: "List services (public)", group: "Services" },
  { method: "POST", path: "/api/v1/services", auth: true, role: "admin", description: "Add a service", group: "Services" },
  { method: "PUT", path: "/api/v1/services/:id", auth: true, role: "admin", description: "Update a service", group: "Services" },
  { method: "DELETE", path: "/api/v1/services/:id", auth: true, role: "admin", description: "Delete a service", group: "Services" },

  // ── FAQs ──
  { method: "GET", path: "/api/v1/faqs", auth: false, description: "List FAQs (public)", group: "FAQs" },
  { method: "POST", path: "/api/v1/faqs", auth: true, role: "admin", description: "Add a FAQ", group: "FAQs" },
  { method: "PUT", path: "/api/v1/faqs/:id", auth: true, role: "admin", description: "Update a FAQ", group: "FAQs" },
  { method: "DELETE", path: "/api/v1/faqs/:id", auth: true, role: "admin", description: "Delete a FAQ", group: "FAQs" },

  // ── Notices ──
  { method: "GET", path: "/api/v1/notices", auth: false, description: "List notices (public)", group: "Notices" },
  { method: "POST", path: "/api/v1/notices", auth: true, role: "admin", description: "Create a notice", body: ["title", "content", "type?", "classLink?", "classSchedule?", "targetCourses?"], group: "Notices" },
  { method: "PUT", path: "/api/v1/notices/:id", auth: true, role: "admin", description: "Update a notice", group: "Notices" },
  { method: "DELETE", path: "/api/v1/notices/:id", auth: true, role: "admin", description: "Delete a notice", group: "Notices" },

  // ── Newsletter ──
  { method: "POST", path: "/api/v1/newsletter", auth: false, description: "Subscribe email to newsletter", body: ["email"], group: "Newsletter" },
  { method: "GET", path: "/api/v1/newsletter", auth: true, role: "admin", description: "List all subscribers (admin)", group: "Newsletter" },

  // ── Contact ──
  { method: "POST", path: "/api/v1/contact", auth: false, description: "Submit contact form", body: ["name", "email", "phone?", "subject", "message"], group: "Contact" },
  { method: "GET", path: "/api/v1/contact-submissions", auth: true, role: "admin", description: "List contact submissions (admin)", group: "Contact" },

  // ── Reviews ──
  { method: "GET", path: "/api/v1/reviews", auth: true, description: "Get my reviews", group: "Reviews" },
  { method: "POST", path: "/api/v1/reviews", auth: true, description: "Submit a course review", body: ["course", "rating", "comment"], group: "Reviews" },
  { method: "PUT", path: "/api/v1/reviews/:id", auth: true, description: "Update my review", group: "Reviews" },
  { method: "DELETE", path: "/api/v1/reviews/:id", auth: true, description: "Delete my review", group: "Reviews" },

  // ── Certificates ──
  { method: "GET", path: "/api/v1/certificates", auth: true, description: "Get my certificates", group: "Certificates" },
  { method: "GET", path: "/api/v1/certificates/:id/verify", auth: false, description: "Verify a certificate by ID", group: "Certificates" },

  // ── Assignments ──
  { method: "GET", path: "/api/v1/assignments", auth: true, description: "List assignments", group: "Assignments" },
  { method: "POST", path: "/api/v1/assignments", auth: true, role: "admin", description: "Create an assignment", group: "Assignments" },
  { method: "PUT", path: "/api/v1/assignments/:id", auth: true, role: "admin", description: "Update an assignment", group: "Assignments" },
  { method: "DELETE", path: "/api/v1/assignments/:id", auth: true, role: "admin", description: "Delete an assignment", group: "Assignments" },

  // ── Submissions ──
  { method: "GET", path: "/api/v1/submissions", auth: true, description: "List submissions", group: "Submissions" },
  { method: "POST", path: "/api/v1/submissions", auth: true, description: "Submit an assignment", body: ["assignment", "fileUrl?", "text?"], group: "Submissions" },
  { method: "PUT", path: "/api/v1/submissions/:id/grade", auth: true, role: "admin", description: "Grade a submission", body: ["grade", "feedback?"], group: "Submissions" },

  // ── Leaderboard ──
  { method: "GET", path: "/api/v1/leaderboard", auth: false, description: "Public leaderboard rankings", group: "Leaderboard" },

  // ── Projects ──
  { method: "GET", path: "/api/v1/projects", auth: false, description: "List student projects (public)", group: "Projects" },
  { method: "POST", path: "/api/v1/projects", auth: true, role: "admin", description: "Add a project", group: "Projects" },
  { method: "PUT", path: "/api/v1/projects/:id", auth: true, role: "admin", description: "Update a project", group: "Projects" },
  { method: "DELETE", path: "/api/v1/projects/:id", auth: true, role: "admin", description: "Delete a project", group: "Projects" },

  // ── Portfolio ──
  { method: "GET", path: "/api/v1/portfolio", auth: false, description: "List portfolio items (public)", group: "Portfolio" },
  { method: "POST", path: "/api/v1/portfolio", auth: true, role: "admin", description: "Add portfolio item", group: "Portfolio" },
  { method: "PUT", path: "/api/v1/portfolio/:id", auth: true, role: "admin", description: "Update portfolio item", group: "Portfolio" },
  { method: "DELETE", path: "/api/v1/portfolio/:id", auth: true, role: "admin", description: "Delete portfolio item", group: "Portfolio" },

  // ── Careers ──
  { method: "GET", path: "/api/v1/careers", auth: false, description: "List job openings (public)", group: "Careers" },
  { method: "POST", path: "/api/v1/careers", auth: true, role: "admin", description: "Add a job opening", group: "Careers" },
  { method: "PUT", path: "/api/v1/careers/:id", auth: true, role: "admin", description: "Update job opening", group: "Careers" },
  { method: "DELETE", path: "/api/v1/careers/:id", auth: true, role: "admin", description: "Delete job opening", group: "Careers" },

  // ── Partners ──
  { method: "GET", path: "/api/v1/partners", auth: false, description: "List partners (public)", group: "Partners" },
  { method: "POST", path: "/api/v1/partners", auth: true, role: "admin", description: "Add a partner", body: ["name", "logo?", "icon?", "color?", "website?", "type?"], group: "Partners" },
  { method: "PUT", path: "/api/v1/partners/:id", auth: true, role: "admin", description: "Update a partner", group: "Partners" },
  { method: "DELETE", path: "/api/v1/partners/:id", auth: true, role: "admin", description: "Delete a partner", group: "Partners" },

  // ── Home Stats ──
  { method: "GET", path: "/api/v1/home-stats", auth: false, description: "List home page stats (public)", group: "Home Stats" },
  { method: "POST", path: "/api/v1/home-stats", auth: true, role: "admin", description: "Add a stat", body: ["label", "value", "suffix?", "icon?", "color?", "section?"], group: "Home Stats" },
  { method: "PUT", path: "/api/v1/home-stats/:id", auth: true, role: "admin", description: "Update a stat", group: "Home Stats" },
  { method: "DELETE", path: "/api/v1/home-stats/:id", auth: true, role: "admin", description: "Delete a stat", group: "Home Stats" },

  // ── Offers ──
  { method: "GET", path: "/api/v1/offers/active", auth: false, description: "Get currently active offers (public)", group: "Offers" },
  { method: "POST", path: "/api/v1/offers/validate-coupon", auth: false, description: "Validate a coupon code", body: ["couponCode"], group: "Offers" },
  { method: "GET", path: "/api/v1/offers", auth: true, role: "admin", description: "List all offers (admin)", group: "Offers" },
  { method: "POST", path: "/api/v1/offers", auth: true, role: "admin", description: "Create an offer", body: ["title", "discountType", "discountValue", "couponCode?", "courses?", "startDate", "endDate", "usageLimit?", "termsAndConditions?"], group: "Offers" },
  { method: "PUT", path: "/api/v1/offers/:id", auth: true, role: "admin", description: "Update an offer", group: "Offers" },
  { method: "DELETE", path: "/api/v1/offers/:id", auth: true, role: "admin", description: "Delete an offer", group: "Offers" },

  // ── Upload ──
  { method: "POST", path: "/api/v1/upload", auth: true, description: "Upload file to Cloudinary (multipart/form-data)", body: ["file (multipart)"], group: "Upload" },

  // ── CMS ──
  { method: "GET", path: "/api/v1/page-content/:slug", auth: false, description: "Get page content by slug (public)", group: "CMS" },
  { method: "PUT", path: "/api/v1/page-content/:slug", auth: true, role: "admin", description: "Update page content (admin)", group: "CMS" },
  { method: "GET", path: "/api/v1/site-settings", auth: false, description: "Get global site settings (public)", group: "CMS" },
  { method: "PUT", path: "/api/v1/site-settings", auth: true, role: "admin", description: "Update site settings (admin)", group: "CMS" },

  // ── Devices ──
  { method: "GET", path: "/api/v1/devices", auth: true, description: "List my device sessions", group: "Devices" },
  { method: "DELETE", path: "/api/v1/devices/:id", auth: true, description: "Remove a device session", group: "Devices" },

  // ── SMS ──
  { method: "GET", path: "/api/v1/sms/status", auth: true, role: "admin", description: "Get SMS Gateway configuration & mode status", group: "SMS" },
  { method: "POST", path: "/api/v1/sms/send-test", auth: true, role: "admin", description: "Send a test SMS message (Admin only)", body: ["to", "message?"], group: "SMS" },

  // ── Dashboard ──
  { method: "GET", path: "/api/v1/dashboard/stats", auth: true, role: "admin", description: "Get admin dashboard stats", group: "Dashboard" },

  // ── Notifications ──
  { method: "GET", path: "/api/v1/notifications", auth: true, description: "Get my notifications", group: "Notifications" },
  { method: "GET", path: "/api/v1/notifications/unread-count", auth: true, description: "Get unread notification count", group: "Notifications" },
  { method: "PUT", path: "/api/v1/notifications/read-all", auth: true, description: "Mark all notifications as read", group: "Notifications" },
  { method: "PUT", path: "/api/v1/notifications/read/:id", auth: true, description: "Mark notification as read", group: "Notifications" },
  { method: "DELETE", path: "/api/v1/notifications/:id", auth: true, description: "Delete a notification", group: "Notifications" },
  { method: "POST", path: "/api/v1/notifications/register-token", auth: true, description: "Register FCM token for push notifications", body: ["fcmToken"], group: "Notifications" },
  { method: "POST", path: "/api/v1/notifications/send", auth: true, role: "admin", description: "Send notification to a user", body: ["userId", "title", "body", "type?"], group: "Notifications" },
  { method: "POST", path: "/api/v1/notifications/send-bulk", auth: true, role: "admin", description: "Send notification to multiple users", body: ["userIds", "title", "body", "type?"], group: "Notifications" },

  // ── Progress ──
  { method: "GET", path: "/api/v1/progress/dashboard", auth: true, description: "Get my courses progress overview", group: "Progress" },
  { method: "GET", path: "/api/v1/progress/:courseId", auth: true, description: "Get course progress details", group: "Progress" },
  { method: "POST", path: "/api/v1/progress/:courseId/:lessonId/complete", auth: true, description: "Mark lesson as complete", group: "Progress" },
  { method: "PUT", path: "/api/v1/progress/:courseId/:lessonId", auth: true, description: "Update lesson progress (watch time, position)", body: ["watchTime?", "lastPosition?"], group: "Progress" },
  { method: "DELETE", path: "/api/v1/progress/:courseId/:lessonId", auth: true, description: "Delete lesson progress", group: "Progress" },

  // ── Certificates (enhanced) ──
  { method: "GET", path: "/api/v1/certificates/verify/:number", auth: false, description: "Verify certificate by number", group: "Certificates" },
  { method: "POST", path: "/api/v1/certificates/generate", auth: true, role: "admin", description: "Generate certificate for completed enrollment", body: ["enrollment"], group: "Certificates" },
];

const groups = [...new Set(endpoints.map(e => e.group))];

const methodColor = {
  GET: "#22c55e",
  POST: "#3b82f6",
  PUT: "#f59e0b",
  DELETE: "#ef4444",
};

const methodBg = {
  GET: "rgba(34,197,94,0.12)",
  POST: "rgba(59,130,246,0.12)",
  PUT: "rgba(245,158,11,0.12)",
  DELETE: "rgba(239,68,68,0.12)",
};

const getDocsHTML = (req, res) => {
  const json = req.query.format === "json";

  if (json) {
    return res.status(200).json({
      name: "KKIT LMS API",
      version: "1.0.0",
      baseUrl: "/api/v1",
      totalEndpoints: endpoints.length,
      groups,
      endpoints,
    });
  }

  const groupBlocks = groups.map(g => {
    const eps = endpoints.filter(e => e.group === g);
    const groupRows = eps.map(e => `
      <tr class="ep-row" data-group="${e.group}" data-method="${e.method}" data-path="${e.path}" data-desc="${e.description}">
        <td><span class="method-badge" style="background:${methodBg[e.method]};color:${methodColor[e.method]}">${e.method}</span></td>
        <td><code class="ep-path">${e.path}</code></td>
        <td>${e.description}</td>
        <td class="center">
          ${e.auth
            ? e.role
              ? `<span class="badge badge-admin" title="Requires ${e.role} role">🛡️ ${e.role}</span>`
              : `<span class="badge badge-auth" title="Requires login">🔒</span>`
            : `<span class="badge badge-public" title="Public endpoint">🌐</span>`
          }
        </td>
        <td class="center">${e.body ? `<code class="body-hint" title="${e.body.join(", ")}">${e.body.length} field${e.body.length > 1 ? "s" : ""}</code>` : `<span class="no-body">—</span>`}</td>
      </tr>
    `).join("");

    return `
      <div class="group" id="group-${g.replace(/[^a-zA-Z0-9]/g, "")}">
        <div class="group-header">${g} <span class="g-count">${eps.length} endpoint${eps.length>1?"s":""}</span></div>
        <table class="ep-table">
          <thead><tr><th>Method</th><th>Path</th><th>Description</th><th>Auth</th><th>Body</th></tr></thead>
          <tbody>${groupRows}</tbody>
        </table>
      </div>`;
  }).join("\n");

  const sidebarItems = groups.map(g => {
    const count = endpoints.filter(e => e.group === g).length;
    return `<a href="#group-${g.replace(/[^a-zA-Z0-9]/g, "")}" class="sidebar-link" data-group="${g}">${g} <span class="count">${count}</span></a>`;
  }).join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>KKIT LMS API Docs</title>
<style>
  :root {
    --bg: #0f0f0f; --surface: #1a1a1a; --surface2: #242424; --border: #2e2e2e;
    --text: #e5e5e5; --text2: #a3a3a3; --accent: #3b82f6;
    --radius: 10px; --sidebar-w: 260px;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }

  /* ── Layout ── */
  .layout { display: flex; min-height: 100vh; }

  /* ── Sidebar ── */
  .sidebar {
    position: fixed; top: 0; left: 0; width: var(--sidebar-w); height: 100vh;
    background: var(--surface); border-right: 1px solid var(--border);
    padding: 24px 16px; overflow-y: auto; z-index: 100;
  }
  .sidebar-logo { font-size: 18px; font-weight: 800; color: var(--accent); margin-bottom: 4px; }
  .sidebar-version { font-size: 11px; color: var(--text2); margin-bottom: 20px; }
  .sidebar-search {
    width: 100%; padding: 8px 12px; background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--radius); color: var(--text); font-size: 13px; margin-bottom: 16px; outline: none;
  }
  .sidebar-search:focus { border-color: var(--accent); }
  .sidebar-search::placeholder { color: var(--text2); }
  .sidebar-link {
    display: flex; align-items: center; justify-content: space-between;
    padding: 7px 12px; border-radius: 6px; color: var(--text2); text-decoration: none;
    font-size: 13px; transition: all 0.15s;
  }
  .sidebar-link:hover, .sidebar-link.active { background: var(--surface2); color: var(--text); }
  .sidebar-link .count {
    font-size: 11px; background: var(--surface2); color: var(--text2);
    padding: 1px 7px; border-radius: 10px;
  }
  .sidebar-stats { margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border); font-size: 12px; color: var(--text2); }
  .sidebar-stats div { margin-bottom: 6px; }

  /* ── Main ── */
  .main { margin-left: var(--sidebar-w); flex: 1; padding: 32px 40px 60px; max-width: 1100px; }

  /* ── Hero ── */
  .hero { margin-bottom: 32px; }
  .hero h1 { font-size: 28px; font-weight: 800; margin-bottom: 4px; }
  .hero p { color: var(--text2); font-size: 15px; }

  /* ── Filters ── */
  .filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 28px; }
  .filter-btn {
    padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border);
    background: transparent; color: var(--text2); font-size: 12px; cursor: pointer;
    transition: all 0.15s;
  }
  .filter-btn:hover { border-color: var(--accent); color: var(--text); }
  .filter-btn.active { background: var(--accent); border-color: var(--accent); color: #fff; }

  /* ── Group ── */
  .group { margin-bottom: 36px; }
  .group-header {
    display: flex; align-items: center; gap: 10px;
    font-size: 16px; font-weight: 700; color: var(--text);
    padding-bottom: 8px; border-bottom: 1px solid var(--border); margin-bottom: 0;
  }
  .group-header .g-count { font-size: 12px; color: var(--text2); font-weight: 400; }

  /* ── Table ── */
  .ep-table { width: 100%; border-collapse: collapse; }
  .ep-table th {
    text-align: left; padding: 10px 12px; font-size: 11px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.5px; color: var(--text2);
    border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg);
  }
  .ep-table td { padding: 10px 12px; border-bottom: 1px solid var(--border); font-size: 13px; vertical-align: middle; }
  .ep-table tr:hover { background: var(--surface); }
  .ep-table .center { text-align: center; }
  .ep-path { font-size: 13px; color: var(--accent); background: none; padding: 0; }

  .method-badge {
    display: inline-block; padding: 2px 8px; border-radius: 5px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.3px; min-width: 52px; text-align: center;
  }
  .badge { font-size: 12px; white-space: nowrap; }
  .badge-admin { color: #f59e0b; }
  .badge-auth { color: #ef4444; }
  .badge-public { color: #22c55e; }
  .body-hint { font-size: 11px; color: var(--text2); background: var(--surface2); padding: 2px 6px; border-radius: 4px; }
  .no-body { color: var(--border); }

  /* ── Legend ── */
  .legend { display: flex; gap: 16px; margin-bottom: 20px; font-size: 12px; color: var(--text2); flex-wrap: wrap; }
  .legend-item { display: flex; align-items: center; gap: 5px; }

  /* ── Toast ── */
  .toast {
    position: fixed; bottom: 24px; right: 24px; background: var(--surface2); color: var(--text);
    padding: 10px 18px; border-radius: var(--radius); font-size: 13px;
    border: 1px solid var(--border); opacity: 0; transform: translateY(10px);
    transition: all 0.2s; pointer-events: none; z-index: 999;
  }
  .toast.show { opacity: 1; transform: translateY(0); }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .sidebar { display: none; }
    .main { margin-left: 0; padding: 20px 16px; }
    .ep-table { font-size: 12px; }
    .ep-table td:nth-child(4), .ep-table td:nth-child(5) { display: none; }
    .ep-table th:nth-child(4), .ep-table th:nth-child(5) { display: none; }
  }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
</style>
</head>
<body>
<div class="layout">

  <!-- Sidebar -->
  <aside class="sidebar">
    <div class="sidebar-logo">⚡ KKIT API</div>
    <div class="sidebar-version">v1.0.0 · ${endpoints.length} endpoints · ${groups.length} modules</div>
    <input type="text" class="sidebar-search" placeholder="Search endpoints..." id="searchInput">
    ${sidebarItems}
    <div class="sidebar-stats">
      <div>🟢 ${endpoints.filter(e=>!e.auth).length} public</div>
      <div>🔒 ${endpoints.filter(e=>e.auth&&!e.role).length} auth required</div>
      <div>🛡️ ${endpoints.filter(e=>e.role).length} admin only</div>
    </div>
  </aside>

  <!-- Main -->
  <main class="main">
    <div class="hero">
      <h1>KKIT LMS API Documentation</h1>
      <p>Base URL: <code style="color:var(--accent)">http://localhost:5000/api/v1</code> &nbsp;·&nbsp; Auth: httpOnly cookies &nbsp;·&nbsp; Format: JSON</p>
    </div>

    <div class="legend">
      <span class="legend-item"><span class="badge badge-public">🌐</span> Public</span>
      <span class="legend-item"><span class="badge badge-auth">🔒</span> Auth Required</span>
      <span class="legend-item"><span class="badge badge-admin">🛡️</span> Admin Only</span>
      <span class="legend-item" style="margin-left:auto; font-size:11px; color:var(--text2)">Tip: append <code>?format=json</code> for raw JSON</span>
    </div>

    <div class="filters">
      <button class="filter-btn active" data-filter="all">All (${endpoints.length})</button>
      <button class="filter-btn" data-filter="method-GET">GET (${endpoints.filter(e=>e.method==="GET").length})</button>
      <button class="filter-btn" data-filter="method-POST">POST (${endpoints.filter(e=>e.method==="POST").length})</button>
      <button class="filter-btn" data-filter="method-PUT">PUT (${endpoints.filter(e=>e.method==="PUT").length})</button>
      <button class="filter-btn" data-filter="method-DELETE">DELETE (${endpoints.filter(e=>e.method==="DELETE").length})</button>
    </div>

    ${groupBlocks}

  </main>
</div>

<div class="toast" id="toast"></div>

<script>
  // ── Search ──
  const search = document.getElementById("searchInput");
  const rows = document.querySelectorAll(".ep-row");
  search.addEventListener("input", () => {
    const q = search.value.toLowerCase();
    rows.forEach(r => {
      r.style.display = r.dataset.path.toLowerCase().includes(q) || r.dataset.desc.toLowerCase().includes(q) || r.dataset.group.toLowerCase().includes(q) ? "" : "none";
    });
  });

  // ── Method filter ──
  const filterBtns = document.querySelectorAll(".filter-btn");
  let activeFilter = "all";
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.filter;
      applyFilter();
    });
  });

  function applyFilter() {
    rows.forEach(r => {
      if (activeFilter === "all") { r.style.display = ""; return; }
      r.style.display = r.dataset.method === activeFilter.replace("method-", "") ? "" : "none";
    });
  }

  // ── Copy path on click ──
  document.querySelectorAll(".ep-path").forEach(el => {
    el.style.cursor = "pointer";
    el.title = "Click to copy";
    el.addEventListener("click", () => {
      navigator.clipboard.writeText(el.textContent);
      const t = document.getElementById("toast");
      t.textContent = "Copied: " + el.textContent;
      t.classList.add("show");
      setTimeout(() => t.classList.remove("show"), 1500);
    });
  });

  // ── Sidebar active on scroll ──
  const sidebarLinks = document.querySelectorAll(".sidebar-link");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        sidebarLinks.forEach(l => l.classList.remove("active"));
        const link = document.querySelector('.sidebar-link[data-group="' + e.target.dataset.group + '"]');
        if (link) link.classList.add("active");
      }
    });
  }, { rootMargin: "-20% 0px -70% 0px" });
  document.querySelectorAll(".group").forEach(g => { observer.observe(g); });
</script>
</body>
</html>`;

  res.status(200).send(html);
};

module.exports = { getDocsHTML };
