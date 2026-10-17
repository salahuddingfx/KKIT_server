const sequelize = require("../config/sequelize");
const Portfolio = require("../modules/portfolio/portfolio.model");

const seedData = [
  {
    title: "Enterprise Learning Management System (LMS)",
    slug: "enterprise-lms-platform",
    description: "A high-scale, real-time e-learning platform built for 50,000+ active students with automated invoice generation, live class scheduling, multi-role RBAC, and video stream optimization.",
    shortDescription: "Enterprise LMS platform handling 50k+ students and live interactive classes.",
    category: "Web Application",
    client: "EduTech Global Corp",
    duration: "4 Months",
    projectType: "client",
    isCaseStudy: true,
    isFeatured: true,
    status: "completed",
    technologies: ["React", "Next.js", "Node.js", "Express", "MongoDB", "Redis", "Tailwind CSS", "Docker"],
    liveUrl: "https://kkitbd.com",
    repoUrl: "https://github.com/kkitbd",
    metrics: { label: "Active Student Retention", value: "98.4%" },
    challenge: "The client needed a robust, high-availability platform to transition from legacy offline classrooms to online interactive courses. The legacy system suffered from slow video buffering, invoice errors, and lack of real-time attendance tracking.",
    solution: "KKIT engineered a Next.js App Router frontend paired with a modular Express micro-service backend. We integrated Redis caching for instant query response, WebSockets for live chat during classes, and PDFKit for automated billing PDF generation.",
    features: [
      "Multi-role Access Control (Super Admin, Instructors, Students, Finance)",
      "Automated bKash / Nagad / Bank Payment verification with instant PDF invoices",
      "Live Class schedule integration with automatic Zoom & Google Meet links",
      "Gamification engine with badges, points history, and leaderboard rankings",
      "Progressive Web App (PWA) support with offline video caching fallback",
    ],
    deliverables: [
      "Production Next.js 16 Web Frontend",
      "Node.js & Express RESTful API",
      "Admin Panel with Revenue Analytics & Charts",
      "Mobile PWA & Service Worker Cache",
    ],
    testimonial: {
      quote: "KKIT delivered an outstanding platform ahead of schedule. Our student engagement doubled within the first month of launch!",
      author: "Rahim Chowdhury",
      designation: "CTO",
      company: "EduTech Global Corp",
    },
  },
  {
    title: "Real-time Fintech Wallet & Payment Gateway Hub",
    slug: "realtime-fintech-wallet",
    description: "High-security financial ledger application with two-factor OTP verification, automated statement generation, and multi-currency exchange rate calculation.",
    shortDescription: "Fintech wallet application with automated statement PDF generation.",
    category: "Fintech",
    client: "PayFlex Solutions",
    duration: "3 Months",
    projectType: "client",
    isCaseStudy: true,
    isFeatured: true,
    status: "completed",
    technologies: ["TypeScript", "Next.js", "Node.js", "PostgreSQL", "Tailwind CSS"],
    liveUrl: "https://kkitbd.com",
    repoUrl: "https://github.com/kkitbd",
    metrics: { label: "Transaction Speed", value: "< 120ms" },
    challenge: "PayFlex needed an ultra-fast, 256-bit encrypted transaction system capable of handling concurrent payment callbacks from bKash, Nagad, and bank webhooks without race conditions.",
    solution: "We designed a transaction queue architecture backed by Redis locks, strictly validated using Zod schemas, with dual SMS OTP authentication.",
    features: [
      "Real-time wallet balance update via WebSockets",
      "Instant PDF transaction receipt generation",
      "Device fingerprinting and suspicious login detection",
      "Role-based financial auditing & refund manager",
    ],
    deliverables: [
      "Fintech Web Portal & Merchant Dashboard",
      "Microservices Backend with Queue Workers",
      "Automated Reconciliation & Audit Logging",
    ],
    testimonial: {
      quote: "The reliability of KKIT's payment queue code has been stellar. Zero downtime since launch!",
      author: "Farhana Islam",
      designation: "Head of Operations",
      company: "PayFlex Solutions",
    },
  },
  {
    title: "AI-Powered Talent Matching & Job Portal",
    slug: "ai-talent-matching-portal",
    description: "An intelligent HR portal utilizing AI vector embeddings to match job seekers with high-growth tech positions with automated ranking and interview pipelines.",
    shortDescription: "AI recruitment platform reducing hiring cycle time by 65%.",
    category: "AI & Cloud",
    client: "CareerBridge Asia",
    duration: "5 Months",
    projectType: "client",
    isCaseStudy: true,
    isFeatured: true,
    status: "completed",
    technologies: ["Python", "FastAPI", "React", "Next.js", "PostgreSQL", "Docker", "Tailwind CSS"],
    liveUrl: "https://kkitbd.com",
    repoUrl: "https://github.com/kkitbd",
    metrics: { label: "Hiring Time Reduction", value: "65%" },
    challenge: "Recruiters spent hundreds of manual hours scanning resumes with high mismatch rates. The client required automated resume parsing, semantic skill ranking, and instant applicant filtering.",
    solution: "Implemented semantic embeddings and vector search combined with automated scoring rubrics and interactive hiring pipelines in Next.js.",
    features: [
      "Automated PDF resume parser with skill extraction",
      "AI semantic similarity matching against job requirements",
      "Kanban hiring pipeline with candidate stages",
      "Automated interview scheduling and calendar sync",
    ],
    deliverables: [
      "Candidate & Employer Web Portals",
      "AI Vector Matching Engine",
      "Employer Analytics Dashboard",
    ],
    testimonial: {
      quote: "KKIT's AI matching solution transformed our hiring velocity by 3x. Truly remarkable engineering.",
      author: "Tanvir Ahmed",
      designation: "VP of Product",
      company: "CareerBridge Asia",
    },
  },
  {
    title: "Multi-Vendor E-Commerce Platform",
    slug: "student-multivendor-ecommerce",
    description: "A scalable multi-vendor marketplace featuring customer storefront, vendor product management, cart checkout with bKash API, and order tracking dashboard.",
    shortDescription: "Multi-vendor marketplace developed as capstone project by KKIT student.",
    category: "Full Stack Web",
    duration: "2 Months",
    projectType: "student",
    studentName: "Shakil Hossain",
    courseName: "Full Stack Web Development with MERN",
    isCaseStudy: false,
    isFeatured: true,
    status: "completed",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Redux Toolkit", "Tailwind CSS"],
    liveUrl: "https://kkitbd.com",
    repoUrl: "https://github.com/kkitbd",
  },
  {
    title: "Healthcare Clinic Telemedicine App",
    slug: "student-telemedicine-app",
    description: "Interactive patient portal allowing online doctor consultation scheduling, prescription management, and encrypted video calls via WebRTC.",
    shortDescription: "Telemedicine platform built by student during advanced Next.js course.",
    category: "Healthcare IT",
    duration: "2 Months",
    projectType: "student",
    studentName: "Nusrat Jahan",
    courseName: "Next.js & Modern Web Architecture",
    isCaseStudy: false,
    isFeatured: false,
    status: "completed",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "WebRTC", "PostgreSQL"],
    liveUrl: "https://kkitbd.com",
    repoUrl: "https://github.com/kkitbd",
  },
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");

    for (const item of seedData) {
      const existing = await Portfolio.findOne({ slug: item.slug });
      if (existing) {
        await existing.update(item);
        console.log(`Updated: ${item.title}`);
      } else {
        await Portfolio.create(item);
        console.log(`Created: ${item.title}`);
      }
    }

    console.log("Portfolios and Case Studies seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
