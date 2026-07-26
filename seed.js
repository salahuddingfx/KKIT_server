const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const env = require("./config/env");

// Models
const User = require("./modules/user/user.model");
const Course = require("./modules/course/course.model");
const Blog = require("./modules/blog/blog.model");
const Faq = require("./modules/faq/faq.model");
const Team = require("./modules/team/team.model");
const Testimonial = require("./modules/testimonial/testimonial.model");
const Pricing = require("./modules/pricing/pricing.model");
const Service = require("./modules/service/service.model");
const Notice = require("./modules/notice/notice.model");
const Category = require("./modules/category/category.model");
const Partner = require("./modules/partner/partner.model");
const HomeStat = require("./modules/home-stat/home-stat.model");
const Offer = require("./modules/offer/offer.model");

const seedData = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear all
    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Blog.deleteMany({}),
      Faq.deleteMany({}),
      Team.deleteMany({}),
      Testimonial.deleteMany({}),
      Pricing.deleteMany({}),
      Service.deleteMany({}),
      Notice.deleteMany({}),
      Category.deleteMany({}),
      Partner.deleteMany({}),
      HomeStat.deleteMany({}),
      Offer.deleteMany({}),
    ]);
    console.log("Cleared existing data");
    await Course.collection.dropIndexes().catch(() => {});

    // ─── USERS ────────────────────────────────────────
    const admin = await User.create({
      name: "Admin KKIT",
      email: "admin@kkit.com",
      password: "admin123",
      role: "super_admin",
      phone: "+8801712345678",
      isActive: true,
      isEmailVerified: true,
    });

    const ceo = await User.create({
      name: "Md. Rafiqul Islam",
      email: "ceo@kkit.com",
      password: "ceo123456",
      role: "ceo",
      phone: "+8801712345679",
      isActive: true,
      isEmailVerified: true,
    });

    const md = await User.create({
      name: "Farhana Akter",
      email: "md@kkit.com",
      password: "md123456",
      role: "md",
      phone: "+8801712345680",
      isActive: true,
      isEmailVerified: true,
    });

    const instructor1 = await User.create({
      name: "Tanvir Hossain",
      email: "tanvir@kkit.com",
      password: "instructor123",
      role: "mentor",
      phone: "+8801712345681",
      isActive: true,
      isEmailVerified: true,
    });

    const instructor2 = await User.create({
      name: "Nusrat Jahan",
      email: "nusrat@kkit.com",
      password: "instructor123",
      role: "mentor",
      phone: "+8801712345682",
      isActive: true,
      isEmailVerified: true,
    });

    const trainer1 = await User.create({
      name: "Imran Khan",
      email: "imran@kkit.com",
      password: "trainer123",
      role: "trainer",
      phone: "+8801712345683",
      isActive: true,
      isEmailVerified: true,
    });

    const trainer2 = await User.create({
      name: "Sumaiya Rahman",
      email: "sumaiya@kkit.com",
      password: "trainer123",
      role: "trainer",
      phone: "+8801712345684",
      isActive: true,
      isEmailVerified: true,
    });

    const demoUser = await User.create({
      name: "Demo Student",
      email: "user@kkit.com",
      password: "user123",
      role: "user",
      phone: "+8801712345685",
      isActive: true,
      isEmailVerified: true,
    });

    console.log("Users created");

    // ─── CATEGORIES ──────────────────────────────────
    const categories = await Category.create([
      { name: "App Development", description: "Mobile and desktop application development", order: 1, color: "#10b981" },
      { name: "Web Development", description: "Full-stack web development courses", order: 2, color: "#6366f1" },
      { name: "Software Development", description: "Software engineering and architecture", order: 3, color: "#f59e0b" },
      { name: "AI/ML", description: "Artificial Intelligence and Machine Learning", order: 4, color: "#ef4444" },
      { name: "Frontend Development", description: "Frontend frameworks and UI/UX", order: 5, color: "#8b5cf6" },
      { name: "Backend Development", description: "Server-side programming and APIs", order: 6, color: "#06b6d4" },
      { name: "Others", description: "Miscellaneous courses", order: 7, color: "#6b7280" },
    ]);

    const catMap = {};
    categories.forEach((c) => { catMap[c.name] = c._id; });
    console.log("Categories created");

    // ─── PARTNERS ─────────────────────────────────────
    await Partner.create([
      { name: "Google", icon: "SiGoogle", color: "#4285F4", type: "hiring", order: 1, website: "https://google.com" },
      { name: "Samsung", icon: "SiSamsung", color: "#1428A0", type: "technology", order: 2, website: "https://samsung.com" },
      { name: "Cisco", icon: "SiCisco", color: "#049FD9", type: "certification", order: 3, website: "https://cisco.com" },
      { name: "Apple", icon: "SiApple", color: "#A2AAAD", type: "hiring", order: 4, website: "https://apple.com" },
      { name: "Meta", icon: "SiMeta", color: "#1877F2", type: "hiring", order: 5, website: "https://meta.com" },
      { name: "Netflix", icon: "SiNetflix", color: "#E50914", type: "hiring", order: 6, website: "https://netflix.com" },
      { name: "GitHub", icon: "SiGithub", color: "#FFFFFF", type: "technology", order: 7, website: "https://github.com" },
      { name: "Tesla", icon: "SiTesla", color: "#CC0000", type: "hiring", order: 8, website: "https://tesla.com" },
      { name: "Spotify", icon: "SiSpotify", color: "#1DB954", type: "hiring", order: 9, website: "https://spotify.com" },
      { name: "Shopify", icon: "SiShopify", color: "#96BF48", type: "placement", order: 10, website: "https://shopify.com" },
      { name: "NVIDIA", icon: "SiNvidia", color: "#76B900", type: "technology", order: 11, website: "https://nvidia.com" },
      { name: "Intel", icon: "SiIntel", color: "#0071C5", type: "technology", order: 12, website: "https://intel.com" },
    ]);
    console.log("Partners created");

    // ─── HOME STATS ──────────────────────────────────
    await HomeStat.create([
      { label: "Students Enrolled", value: "12000", suffix: "+", icon: "Users", color: "#6366f1", order: 1, section: "stats" },
      { label: "Courses Available", value: "50", suffix: "+", icon: "BookOpen", color: "#10b981", order: 2, section: "stats" },
      { label: "Expert Instructors", value: "25", suffix: "+", icon: "Award", color: "#f59e0b", order: 3, section: "stats" },
      { label: "Job Placement Rate", value: "94", suffix: "%", icon: "TrendingUp", color: "#ef4444", order: 4, section: "stats" },
      { label: "Countries Reached", value: "30", suffix: "+", icon: "Globe", color: "#06b6d4", order: 5, section: "stats" },
      { label: "Success Stories", value: "5000", suffix: "+", icon: "Heart", color: "#ec4899", order: 6, section: "stats" },
      { label: "Years Experience", value: "8", suffix: "+", icon: "Calendar", color: "#8b5cf6", order: 7, section: "stats" },
      { label: "Happy Students", value: "15000", suffix: "+", icon: "Smile", color: "#14b8a6", order: 8, section: "stats" },
    ]);
    console.log("Home Stats created");



    // ─── COURSES ──────────────────────────────────────
    const courses = await Course.create([
      {
        title: "Complete Web Development Bootcamp 2026",
        description: "Master HTML, CSS, JavaScript, React, Next.js, Node.js, MongoDB and build real-world projects. This comprehensive bootcamp takes you from zero to job-ready full-stack developer.",
        shortDescription: "Learn full-stack web development from scratch with hands-on projects.",
        instructor: instructor1._id,
        category: catMap["Web Development"],
        tags: ["web", "javascript", "react", "nodejs", "fullstack"],
        level: "beginner",
        price: 4999,
        discountPrice: 2999,
        currency: "BDT",
        totalDuration: 86,
        totalLessons: 42,
        enrolledStudents: 1250,
        rating: { average: 4.8, count: 340 },
        prerequisites: ["Basic computer knowledge", "Internet access"],
        learningOutcomes: [
          "Build 15+ real projects",
          "Master React & Next.js",
          "Learn Node.js & Express",
          "Work with MongoDB",
          "Deploy to production",
        ],
        status: "published",
        isFeatured: true,
        modules: [
          {
            title: "HTML & CSS Fundamentals",
            description: "Learn the building blocks of web pages",
            order: 1,
            lessons: [
              { title: "Introduction to HTML5", description: "HTML document structure, tags, forms", duration: 45, order: 1, isFree: true },
              { title: "CSS Box Model & Flexbox", description: "Master layout with Flexbox", duration: 55, order: 2, isFree: true },
              { title: "CSS Grid & Responsive Design", description: "Build responsive layouts", duration: 50, order: 3 },
              { title: "Project: Portfolio Website", description: "Build your portfolio from scratch", duration: 60, order: 4 },
            ],
          },
          {
            title: "JavaScript Mastery",
            description: "Deep dive into modern JavaScript",
            order: 2,
            lessons: [
              { title: "Variables, Functions & Scope", description: "Core JS concepts", duration: 50, order: 1 },
              { title: "DOM Manipulation", description: "Interactive web pages", duration: 45, order: 2 },
              { title: "Async JavaScript & Fetch API", description: "Promises, async/await", duration: 55, order: 3 },
              { title: "ES6+ Features", description: "Arrow functions, destructuring, modules", duration: 40, order: 4 },
            ],
          },
          {
            title: "React & Next.js",
            description: "Modern frontend development",
            order: 3,
            lessons: [
              { title: "React Components & Props", description: "Component-based architecture", duration: 50, order: 1 },
              { title: "State Management & Hooks", description: "useState, useEffect, custom hooks", duration: 55, order: 2 },
              { title: "Next.js App Router", description: "Server components, routing", duration: 60, order: 3 },
              { title: "Project: Full-Stack App", description: "Build a complete app", duration: 90, order: 4 },
            ],
          },
          {
            title: "Backend with Node.js",
            description: "Server-side development",
            order: 4,
            lessons: [
              { title: "Node.js & Express Basics", description: "REST APIs", duration: 50, order: 1 },
              { title: "MongoDB & Mongoose", description: "Database operations", duration: 55, order: 2 },
              { title: "Authentication & JWT", description: "Secure your APIs", duration: 60, order: 3 },
              { title: "Deployment", description: "Deploy to Vercel/Railway", duration: 45, order: 4 },
            ],
          },
        ],
      },
      {
        title: "Python for Data Science & Machine Learning",
        description: "Learn Python programming, Pandas, NumPy, Matplotlib, Scikit-learn, and TensorFlow. Build ML models and analyze real datasets.",
        shortDescription: "Master Python for data analysis and machine learning.",
        instructor: instructor2._id,
        category: catMap["AI/ML"],
        tags: ["python", "data-science", "machine-learning", "ai"],
        level: "beginner",
        price: 5999,
        discountPrice: 3999,
        currency: "BDT",
        totalDuration: 72,
        totalLessons: 36,
        enrolledStudents: 890,
        rating: { average: 4.7, count: 210 },
        prerequisites: ["Basic math", "No programming experience needed"],
        learningOutcomes: [
          "Write Python programs",
          "Analyze data with Pandas",
          "Build ML models",
          "Visualize data professionally",
        ],
        status: "published",
        isFeatured: true,
        modules: [
          {
            title: "Python Basics",
            order: 1,
            lessons: [
              { title: "Python Setup & Variables", duration: 40, order: 1, isFree: true },
              { title: "Control Flow & Loops", duration: 45, order: 2 },
              { title: "Functions & OOP", duration: 55, order: 3 },
            ],
          },
          {
            title: "Data Analysis with Pandas",
            order: 2,
            lessons: [
              { title: "Pandas DataFrames", duration: 50, order: 1, isFree: true },
              { title: "Data Cleaning", duration: 45, order: 2 },
              { title: "Data Visualization", duration: 50, order: 3 },
            ],
          },
          {
            title: "Machine Learning",
            order: 3,
            lessons: [
              { title: "Intro to ML", duration: 40, order: 1 },
              { title: "Supervised Learning", duration: 55, order: 2 },
              { title: "Model Evaluation", duration: 50, order: 3 },
            ],
          },
        ],
      },
      {
        title: "Digital Marketing Mastery",
        description: "Complete digital marketing course covering SEO, social media marketing, Google Ads, Facebook Ads, email marketing, and analytics.",
        shortDescription: "Master all digital marketing channels and strategies.",
        instructor: instructor1._id,
        category: catMap["Others"],
        tags: ["marketing", "seo", "social-media", "ads"],
        level: "intermediate",
        price: 3999,
        discountPrice: 2499,
        currency: "BDT",
        totalDuration: 48,
        totalLessons: 24,
        enrolledStudents: 650,
        rating: { average: 4.6, count: 180 },
        prerequisites: ["Basic internet knowledge"],
        learningOutcomes: [
          "Run Google & Facebook Ads",
          "Master SEO techniques",
          "Build email marketing campaigns",
          "Analyze marketing data",
        ],
        status: "published",
        isFeatured: true,
        modules: [
          {
            title: "SEO Fundamentals",
            order: 1,
            lessons: [
              { title: "Keyword Research", duration: 45, order: 1, isFree: true },
              { title: "On-Page SEO", duration: 40, order: 2 },
              { title: "Off-Page SEO & Link Building", duration: 50, order: 3 },
            ],
          },
          {
            title: "Social Media Marketing",
            order: 2,
            lessons: [
              { title: "Facebook & Instagram Ads", duration: 55, order: 1 },
              { title: "LinkedIn Marketing", duration: 40, order: 2 },
            ],
          },
        ],
      },
      {
        title: "UI/UX Design with Figma",
        description: "Learn user interface and experience design principles, wireframing, prototyping, and design systems using Figma.",
        shortDescription: "Design beautiful, user-friendly interfaces with Figma.",
        instructor: instructor2._id,
        category: catMap["Frontend Development"],
        tags: ["design", "ui", "ux", "figma"],
        level: "beginner",
        price: 3499,
        discountPrice: 1999,
        currency: "BDT",
        totalDuration: 36,
        totalLessons: 18,
        enrolledStudents: 420,
        rating: { average: 4.9, count: 95 },
        prerequisites: ["Creativity", "Computer with Figma installed"],
        learningOutcomes: [
          "Design in Figma professionally",
          "Create wireframes & prototypes",
          "Build design systems",
          "UX research methods",
        ],
        status: "published",
        isFeatured: true,
        modules: [
          {
            title: "Design Thinking",
            order: 1,
            lessons: [
              { title: "Introduction to UX", duration: 35, order: 1, isFree: true },
              { title: "User Research", duration: 40, order: 2 },
            ],
          },
          {
            title: "Figma Mastery",
            order: 2,
            lessons: [
              { title: "Figma Interface", duration: 30, order: 1, isFree: true },
              { title: "Components & Auto Layout", duration: 45, order: 2 },
              { title: "Prototyping", duration: 50, order: 3 },
            ],
          },
        ],
      },
      {
        title: "Flutter Mobile App Development",
        description: "Build cross-platform mobile apps for iOS and Android using Flutter and Dart. From basics to publishing on app stores.",
        shortDescription: "Build beautiful cross-platform mobile apps with Flutter.",
        instructor: trainer1._id,
        category: catMap["App Development"],
        tags: ["flutter", "dart", "mobile", "android", "ios"],
        level: "intermediate",
        price: 5499,
        discountPrice: 3499,
        currency: "BDT",
        totalDuration: 64,
        totalLessons: 32,
        enrolledStudents: 380,
        rating: { average: 4.8, count: 120 },
        prerequisites: ["Basic programming knowledge"],
        learningOutcomes: [
          "Build iOS & Android apps",
          "Master Dart language",
          "Publish to App Store & Play Store",
          "State management with Provider/Riverpod",
        ],
        status: "published",
        isFeatured: false,
        modules: [
          {
            title: "Dart & Flutter Basics",
            order: 1,
            lessons: [
              { title: "Dart Language", duration: 50, order: 1, isFree: true },
              { title: "Flutter Widgets", duration: 55, order: 2 },
            ],
          },
          {
            title: "Building Apps",
            order: 2,
            lessons: [
              { title: "Navigation & Routing", duration: 45, order: 1 },
              { title: "API Integration", duration: 50, order: 2 },
              { title: "Publishing", duration: 40, order: 3 },
            ],
          },
        ],
      },
      {
        title: "Graphics Design with Adobe Creative Suite",
        description: "Master Photoshop, Illustrator, and InDesign for professional graphic design work.",
        shortDescription: "Professional graphic design with Adobe tools.",
        instructor: trainer2._id,
        category: catMap["Others"],
        tags: ["design", "photoshop", "illustrator", "graphic"],
        level: "beginner",
        price: 2999,
        discountPrice: 1499,
        currency: "BDT",
        totalDuration: 42,
        totalLessons: 21,
        enrolledStudents: 310,
        rating: { average: 4.5, count: 88 },
        prerequisites: [],
        learningOutcomes: [
          "Master Photoshop editing",
          "Create vector art in Illustrator",
          "Design print layouts in InDesign",
        ],
        status: "published",
        isFeatured: false,
        modules: [
          {
            title: "Photoshop Essentials",
            order: 1,
            lessons: [
              { title: "Interface & Tools", duration: 40, order: 1, isFree: true },
              { title: "Photo Editing", duration: 50, order: 2 },
            ],
          },
        ],
      },
      {
        title: "Cybersecurity Fundamentals",
        description: "Learn ethical hacking, network security, vulnerability assessment, and security best practices.",
        shortDescription: "Learn cybersecurity from scratch.",
        instructor: instructor1._id,
        category: catMap["Software Development"],
        tags: ["security", "hacking", "network"],
        level: "intermediate",
        price: 6999,
        discountPrice: 4999,
        currency: "BDT",
        totalDuration: 56,
        totalLessons: 28,
        enrolledStudents: 220,
        rating: { average: 4.7, count: 65 },
        prerequisites: ["Basic networking knowledge", "Linux basics"],
        learningOutcomes: [
          "Identify security vulnerabilities",
          "Perform penetration testing",
          "Secure networks and systems",
        ],
        status: "published",
        isFeatured: false,
        modules: [
          {
            title: "Security Fundamentals",
            order: 1,
            lessons: [
              { title: "CIA Triad & Threats", duration: 40, order: 1, isFree: true },
              { title: "Network Security", duration: 50, order: 2 },
            ],
          },
        ],
      },
      {
        title: "English Communication Skills",
        description: "Improve your English speaking, writing, and presentation skills for professional success.",
        shortDescription: "Master English for career advancement.",
        instructor: trainer2._id,
        category: catMap["Others"],
        tags: ["english", "communication", "speaking"],
        level: "beginner",
        price: 1999,
        discountPrice: 999,
        currency: "BDT",
        totalDuration: 30,
        totalLessons: 15,
        enrolledStudents: 780,
        rating: { average: 4.4, count: 250 },
        prerequisites: [],
        learningOutcomes: [
          "Confident English speaking",
          "Professional email writing",
          "Presentation skills",
        ],
        status: "published",
        isFeatured: false,
        modules: [
          {
            title: "Speaking Skills",
            order: 1,
            lessons: [
              { title: "Pronunciation Basics", duration: 30, order: 1, isFree: true },
              { title: "Conversation Practice", duration: 35, order: 2 },
            ],
          },
        ],
      },
    ]);
    console.log("Courses created");

    // ─── OFFERS ──────────────────────────────────────
    await Offer.create([
      {
        title: "Mega Summer Sale 2026",
        shortDescription: "Get up to 50% off on all web development courses. Limited time offer!",
        description: "Our biggest sale of the year is here. Save big on our most popular courses and accelerate your tech career.",
        badge: "Flash Sale",
        discountType: "percentage",
        discountValue: 50,
        couponCode: "SUMMER50",
        courses: courses.slice(0, 3).map((c) => c._id),
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isActive: true,
        isFeatured: true,
        priority: 10,
        termsAndConditions: "Valid on selected courses only. Cannot be combined with other offers.",
      },
      {
        title: "New Student Welcome Offer",
        shortDescription: "Flat 30% off for new students. Start your learning journey today!",
        badge: "New Users",
        discountType: "percentage",
        discountValue: 30,
        couponCode: "WELCOME30",
        courses: courses.slice(3, 6).map((c) => c._id),
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
        isFeatured: true,
        priority: 8,
      },
      {
        title: "AI/ML Bundle Deal",
        shortDescription: "Buy any AI course and get a second one free!",
        badge: "BOGO",
        discountType: "bogo",
        discountValue: 0,
        couponCode: "AIBOGO",
        courses: courses.filter((c) => {
          const catId = c.category?.toString();
          const aiCat = categories.find((cat) => cat.name === "AI/ML");
          return catId === aiCat?._id;
        }).map((c) => c._id),
        startDate: new Date(),
        isActive: true,
        isFeatured: false,
        priority: 5,
      },
    ]);
    console.log("Offers created");

    // ─── BLOGS ────────────────────────────────────────
    await Blog.create([
      {
        title: "Why Bangladesh is Becoming a Tech Hub in 2026",
        content: `Bangladesh's tech industry has grown exponentially over the past few years. With government initiatives like Hi-Tech Parks and growing startup ecosystem, the country is positioning itself as a major player in South Asian tech.\n\nThe IT sector exported over $2 billion in services last year, and the number is expected to double by 2028. Companies like ShopUp, bKash, and Pathao have shown that Bangladeshi startups can compete globally.\n\nKey factors driving this growth include:\n- Young, tech-savvy population\n- Competitive labor costs\n- Government incentives\n- Growing internet penetration\n\nAt KKIT, we're training the next generation of tech professionals to lead this revolution.`,
        excerpt: "Bangladesh's IT sector is booming — here's why and what it means for your career.",
        author: admin._id,
        category: "Technology",
        tags: ["bangladesh", "tech", "career", "startup"],
        status: "published",
        featured: true,
        views: 1240,
        likes: 89,
        publishedAt: new Date("2026-07-10"),
      },
      {
        title: "10 JavaScript Tips Every Developer Should Know in 2026",
        content: `JavaScript continues to evolve. Here are 10 tips that will make you a better developer:\n\n1. Use optional chaining (?.) to avoid nested null checks\n2. Nullish coalescing (??) for better default values\n3. Array.at() for negative indexing\n4. structuredClone() for deep cloning\n5. Top-level await in modules\n6. Object.hasOwn() instead of hasOwnProperty\n7. Error.cause for error chaining\n8. Array.findLast() and findLastIndex()\n9. Promise.allSettled() for parallel operations\n10. Temporal API for date handling\n\nThese features are now supported in all modern browsers and Node.js.`,
        excerpt: "Level up your JavaScript skills with these modern techniques.",
        author: instructor1._id,
        category: "Programming",
        tags: ["javascript", "tips", "web-development"],
        status: "published",
        featured: true,
        views: 2890,
        likes: 156,
        publishedAt: new Date("2026-07-05"),
      },
      {
        title: "How to Start a Career in Data Science from Bangladesh",
        content: `Data Science is one of the most sought-after careers globally. Here's how you can start from Bangladesh:\n\nStep 1: Learn Python fundamentals\nStep 2: Master Pandas and NumPy\nStep 3: Understand statistics and probability\nStep 4: Learn machine learning basics with Scikit-learn\nStep 5: Build portfolio projects\nStep 6: Apply for remote jobs or local companies\n\nAverage salary for data scientists in Bangladesh ranges from BDT 40,000 to 120,000 per month, with remote international positions paying significantly more.`,
        excerpt: "A complete roadmap to becoming a data scientist from Bangladesh.",
        author: instructor2._id,
        category: "Career",
        tags: ["data-science", "career", "python"],
        status: "published",
        views: 1850,
        likes: 112,
        publishedAt: new Date("2026-06-28"),
      },
      {
        title: "The Future of AI in Education",
        content: `Artificial Intelligence is transforming how we learn and teach. From personalized learning paths to automated grading, AI is making education more accessible and effective.\n\nAt KKIT, we're integrating AI-powered tools to:\n- Provide personalized course recommendations\n- Offer AI tutoring assistants\n- Automate administrative tasks\n- Generate custom learning materials\n\nHowever, AI should augment, not replace, human teachers. The best learning happens when technology and human expertise work together.`,
        excerpt: "How AI is reshaping education and what it means for learners.",
        author: admin._id,
        category: "Education",
        tags: ["ai", "education", "future"],
        status: "published",
        views: 980,
        likes: 67,
        publishedAt: new Date("2026-06-20"),
      },
      {
        title: "Top 5 Remote Work Tools for Bangladeshi Freelancers",
        content: `Remote work is booming in Bangladesh. Here are the top tools every freelancer needs:\n\n1. Slack — Team communication\n2. Notion — Project management\n3. Figma — Design collaboration\n4. GitHub — Code hosting\n5. Zoom — Video meetings\n\nWith these tools, you can work with clients from anywhere in the world. Many Bangladeshi freelancers are earning $2000-5000/month working remotely.`,
        excerpt: "Essential tools for the modern Bangladeshi freelancer.",
        author: instructor1._id,
        category: "Freelancing",
        tags: ["freelancing", "remote-work", "tools"],
        status: "published",
        views: 1450,
        likes: 93,
        publishedAt: new Date("2026-06-15"),
      },
      {
        title: "Understanding Web Security: A Beginner's Guide",
        content: `Web security is crucial for every developer. Common threats include:\n\n- SQL Injection\n- Cross-Site Scripting (XSS)\n- Cross-Site Request Forgery (CSRF)\n- Man-in-the-Middle attacks\n\nProtection strategies:\n1. Always sanitize user input\n2. Use HTTPS everywhere\n3. Implement Content Security Policy\n4. Use parameterized queries\n5. Keep dependencies updated\n\nSecurity is not an option — it's a requirement.`,
        excerpt: "Protect your web applications from common security threats.",
        author: instructor1._id,
        category: "Security",
        tags: ["security", "web", "beginner"],
        status: "published",
        views: 760,
        likes: 45,
        publishedAt: new Date("2026-06-10"),
      },
    ]);
    console.log("Blogs created");

    // ─── TEAM ─────────────────────────────────────────
    await Team.create([
      {
        name: "Md. Rafiqul Islam",
        designation: "Chief Executive Officer (CEO)",
        department: "Leadership",
        bio: "Visionary leader with 15+ years of experience in technology and education. Founded KKIT with the mission to make quality tech education accessible to all Bangladeshis.",
        email: "ceo@kkit.com",
        socialLinks: { linkedin: "https://linkedin.com/in/rafiqul", facebook: "https://facebook.com/rafiqul" },
        user: ceo._id,
        status: "active",
        order: 1,
      },
      {
        name: "Farhana Akter",
        designation: "Managing Director (MD)",
        department: "Leadership",
        bio: "Experienced education professional passionate about creating inclusive learning environments. Leads KKIT's operations and strategic partnerships.",
        email: "md@kkit.com",
        socialLinks: { linkedin: "https://linkedin.com/in/farhana", facebook: "https://facebook.com/farhana" },
        user: md._id,
        status: "active",
        order: 2,
      },
      {
        name: "Tanvir Hossain",
        designation: "Lead Instructor — Web Development",
        department: "Training",
        bio: "Full-stack developer with 8+ years of experience at companies like Grameenphone and Banglalink. Specializes in React, Node.js, and cloud architecture.",
        email: "tanvir@kkit.com",
        socialLinks: { linkedin: "https://linkedin.com/in/tanvir", github: "https://github.com/tanvir" },
        user: instructor1._id,
        status: "active",
        order: 3,
      },
      {
        name: "Nusrat Jahan",
        designation: "Lead Instructor — Data Science",
        department: "Training",
        bio: "Data scientist and ML engineer. Previously worked at Robi Axiata. Holds MSc in Computer Science from BUET.",
        email: "nusrat@kkit.com",
        socialLinks: { linkedin: "https://linkedin.com/in/nusrat", github: "https://github.com/nusrat" },
        user: instructor2._id,
        status: "active",
        order: 4,
      },
      {
        name: "Imran Khan",
        designation: "Trainer — Mobile Development",
        department: "Training",
        bio: "Flutter and React Native developer. Built 20+ mobile apps for clients worldwide. Passionate about teaching mobile development.",
        email: "imran@kkit.com",
        socialLinks: { linkedin: "https://linkedin.com/in/imran", github: "https://github.com/imran" },
        user: trainer1._id,
        status: "active",
        order: 5,
      },
      {
        name: "Sumaiya Rahman",
        designation: "Trainer — Design & English",
        department: "Training",
        bio: "UI/UX designer and certified English instructor. Brings creative design thinking and communication skills to KKIT's curriculum.",
        email: "sumaiya@kkit.com",
        socialLinks: { linkedin: "https://linkedin.com/in/sumaiya", facebook: "https://facebook.com/sumaiya" },
        user: trainer2._id,
        status: "active",
        order: 6,
      },
    ]);
    console.log("Team created");

    // ─── TESTIMONIALS ─────────────────────────────────
    await Testimonial.create([
      {
        name: "Ariful Islam",
        designation: "Frontend Developer at bKash",
        company: "bKash Ltd.",
        content: "KKIT's Web Development Bootcamp completely changed my career. I went from knowing nothing about coding to landing a frontend developer job at bKash in just 6 months. The instructors are incredibly supportive and the projects are real-world applicable.",
        rating: 5,
        user: demoUser._id,
        course: courses[0]._id,
        status: "approved",
        featured: true,
        order: 1,
      },
      {
        name: "Fatema Begum",
        designation: "Data Analyst at Grameenphone",
        company: "Grameenphone",
        content: "The Data Science course at KKIT gave me practical skills that I use daily at work. The Python and Pandas modules were especially well-structured. I highly recommend this course to anyone interested in data science.",
        rating: 5,
        course: courses[1]._id,
        status: "approved",
        featured: true,
        order: 2,
      },
      {
        name: "Sakib Ahmed",
        designation: "Freelance Marketer",
        company: "Self-employed",
        content: "After completing the Digital Marketing course, I started freelancing and now earn more than my previous full-time job. The SEO and social media modules were game-changers for my freelance career.",
        rating: 4,
        course: courses[2]._id,
        status: "approved",
        featured: true,
        order: 3,
      },
      {
        name: "Nadira Khan",
        designation: "UI Designer at ShopUp",
        company: "ShopUp",
        content: "The UI/UX Design course helped me transition from graphic design to product design. The Figma modules were excellent and the portfolio projects helped me land my dream job.",
        rating: 5,
        course: courses[3]._id,
        status: "approved",
        featured: false,
        order: 4,
      },
      {
        name: "Rakib Hasan",
        designation: "Mobile Developer at Evaly",
        company: "Evaly",
        content: "KKIT's Flutter course is the best investment I've made. The step-by-step approach and real projects made learning Flutter easy and fun. I've already published 3 apps on the Play Store.",
        rating: 5,
        course: courses[4]._id,
        status: "approved",
        featured: false,
        order: 5,
      },
      {
        name: "Tasnim Rahman",
        designation: "Student at BUET",
        company: "BUET",
        content: "As a university student, KKIT's courses complement my academic studies perfectly. The practical approach helps me understand concepts better and build a strong portfolio.",
        rating: 4,
        status: "approved",
        featured: false,
        order: 6,
      },
    ]);
    console.log("Testimonials created");

    // ─── PRICING ──────────────────────────────────────
    await Pricing.create([
      {
        name: "Basic",
        price: 0,
        period: "month",
        description: "Get started with free courses and community access.",
        features: [
          { text: "Access to free courses", included: true },
          { text: "Community forum access", included: true },
          { text: "Weekly newsletter", included: true },
          { text: "Certificate of completion", included: false },
          { text: "1-on-1 mentorship", included: false },
          { text: "Job placement support", included: false },
        ],
        isPopular: false,
        status: "active",
        order: 1,
        badge: "",
      },
      {
        name: "Pro",
        price: 1999,
        period: "month",
        description: "Best for serious learners who want to level up.",
        features: [
          { text: "All free courses", included: true },
          { text: "All premium courses", included: true },
          { text: "Certificate of completion", included: true },
          { text: "Community forum access", included: true },
          { text: "Monthly live sessions", included: true },
          { text: "1-on-1 mentorship (2/month)", included: true },
          { text: "Job placement support", included: false },
        ],
        isPopular: true,
        status: "active",
        order: 2,
        badge: "Most Popular",
      },
      {
        name: "Enterprise",
        price: 4999,
        period: "month",
        description: "For teams and organizations needing custom training.",
        features: [
          { text: "Everything in Pro", included: true },
          { text: "Custom learning paths", included: true },
          { text: "Unlimited mentorship", included: true },
          { text: "Priority support", included: true },
          { text: "Job placement guarantee", included: true },
          { text: "Team analytics dashboard", included: true },
          { text: "Custom course creation", included: true },
        ],
        isPopular: false,
        status: "active",
        order: 3,
        badge: "Best Value",
      },
    ]);
    console.log("Pricing created");

    // ─── SERVICES ─────────────────────────────────────
    await Service.create([
      {
        title: "Web Development",
        description: "We build modern, responsive websites and web applications using the latest technologies. From simple landing pages to complex SaaS platforms.",
        shortDescription: "Custom web applications built with React, Next.js, and Node.js.",
        icon: "Globe",
        features: ["Custom web apps", "E-commerce solutions", "CMS development", "API development", "Performance optimization"],
        technologies: ["React", "Next.js", "Node.js", "MongoDB", "PostgreSQL"],
        pricing: { startingAt: 25000, period: "project" },
        status: "active",
        order: 1,
      },
      {
        title: "Mobile App Development",
        description: "Cross-platform mobile applications for iOS and Android using Flutter and React Native. Native performance with a single codebase.",
        shortDescription: "iOS & Android apps with Flutter and React Native.",
        icon: "Smartphone",
        features: ["Cross-platform apps", "Native iOS/Android", "App Store deployment", "Push notifications", "Offline support"],
        technologies: ["Flutter", "React Native", "Dart", "Firebase"],
        pricing: { startingAt: 50000, period: "project" },
        status: "active",
        order: 2,
      },
      {
        title: "UI/UX Design",
        description: "User-centered design that converts. We create intuitive interfaces and seamless user experiences backed by research and testing.",
        shortDescription: "Beautiful, user-centered design that drives results.",
        icon: "Palette",
        features: ["User research", "Wireframing", "Prototyping", "Design systems", "Usability testing"],
        technologies: ["Figma", "Adobe XD", "Sketch", "InVision"],
        pricing: { startingAt: 15000, period: "project" },
        status: "active",
        order: 3,
      },
      {
        title: "Digital Marketing",
        description: "Data-driven marketing strategies that deliver ROI. SEO, social media, PPC, and content marketing for businesses of all sizes.",
        shortDescription: "Data-driven marketing for maximum ROI.",
        icon: "TrendingUp",
        features: ["SEO optimization", "Social media marketing", "Google Ads", "Facebook Ads", "Analytics & reporting"],
        technologies: ["Google Analytics", "SEMrush", "HubSpot", "Mailchimp"],
        pricing: { startingAt: 10000, period: "month" },
        status: "active",
        order: 4,
      },
      {
        title: "Corporate Training",
        description: "Customized training programs for organizations. Upskill your team with hands-on workshops led by industry experts.",
        shortDescription: "Custom tech training for your team.",
        icon: "Users",
        features: ["Custom curriculum", "On-site training", "Online workshops", "Assessment & certification", "Progress tracking"],
        technologies: ["Various tech stacks"],
        pricing: { startingAt: 50000, period: "batch" },
        status: "active",
        order: 5,
      },
      {
        title: "IT Consulting",
        description: "Strategic technology consulting to help businesses make the right decisions. From architecture design to digital transformation.",
        shortDescription: "Strategic tech consulting for your business.",
        icon: "Lightbulb",
        features: ["Technology audit", "Architecture design", "Digital transformation", "Cloud migration", "Security assessment"],
        technologies: ["AWS", "Azure", "GCP", "Docker", "Kubernetes"],
        pricing: { startingAt: 20000, period: "session" },
        status: "active",
        order: 6,
      },
    ]);
    console.log("Services created");

    // ─── FAQS ─────────────────────────────────────────
    await Faq.create([
      { question: "How do I enroll in a course?", answer: "Click 'Enroll Now' on any course page, select your payment method, and complete the payment. You'll get instant access after confirmation.", category: "courses", order: 1 },
      { question: "What payment methods do you accept?", answer: "We accept bKash, Nagad, bank transfer, and credit/debit cards via Stripe. All local payment methods are supported.", category: "payments", order: 2 },
      { question: "Can I get a refund?", answer: "Yes, we offer a 30-day money-back guarantee on all courses. If you're not satisfied, contact us for a full refund.", category: "payments", order: 3 },
      { question: "How long do I have access to a course?", answer: "You get lifetime access to all enrolled courses, including future updates.", category: "courses", order: 4 },
      { question: "Do I get a certificate?", answer: "Yes, you receive a verified certificate of completion after finishing all course modules and passing the assessments.", category: "courses", order: 5 },
      { question: "Are the courses self-paced?", answer: "Yes, all courses are self-paced. You can learn at your own speed and revisit lessons anytime.", category: "courses", order: 6 },
      { question: "Do you offer corporate training?", answer: "Yes, we provide customized training programs for organizations. Contact us at info@kkit.com for details.", category: "general", order: 7 },
      { question: "How can I contact support?", answer: "You can reach us at info@kkit.com or call +880 1XXXXXXXXX. Our support team is available Saturday-Thursday, 10AM-8PM.", category: "general", order: 8 },
    ]);
    console.log("FAQs created");

    // ─── NOTICES ──────────────────────────────────────
    await Notice.create([
      {
        title: "Welcome to KKIT — New Platform Launch",
        content: "We're excited to announce the launch of our new learning platform! Explore our courses, join the community, and start your tech journey today.",
        type: "general",
        priority: "high",
        targetAudience: "all",
        author: admin._id,
        isActive: true,
        isPinned: true,
      },
      {
        title: "Eid Holiday Schedule",
        content: "KKIT will be closed from July 8-10 for Eid-ul-Adha. All live sessions during this period will be rescheduled. Support will be limited.",
        type: "info",
        priority: "medium",
        targetAudience: "all",
        author: admin._id,
        isActive: true,
        isPinned: false,
        expiresAt: new Date("2026-07-15"),
      },
      {
        title: "New Course: Cybersecurity Fundamentals",
        content: "We've launched our new Cybersecurity course! Learn ethical hacking, network security, and vulnerability assessment. Enroll now at a discounted price.",
        type: "info",
        priority: "medium",
        targetAudience: "all",
        author: admin._id,
        isActive: true,
        isPinned: false,
      },
      {
        title: "System Maintenance — July 20",
        content: "Scheduled maintenance on July 20, 2AM-6AM BST. The platform may be temporarily unavailable during this time.",
        type: "maintenance",
        priority: "high",
        targetAudience: "all",
        author: admin._id,
        isActive: true,
        isPinned: false,
        expiresAt: new Date("2026-07-21"),
      },
    ]);
    console.log("Notices created");

    console.log("\n═══════════════════════════════════════════");
    console.log("  SEED DATA CREATED SUCCESSFULLY!");
    console.log("═══════════════════════════════════════════");
    console.log("\n  Accounts:");
    console.log("  ─────────────────────────────────────");
    console.log("  Admin:     admin@kkit.com / admin123");
    console.log("  CEO:       ceo@kkit.com / ceo123456");
    console.log("  MD:        md@kkit.com / md123456");
    console.log("  Mentor:    tanvir@kkit.com / instructor123");
    console.log("  Mentor:    nusrat@kkit.com / instructor123");
    console.log("  Trainer:   imran@kkit.com / trainer123");
    console.log("  Trainer:   sumaiya@kkit.com / trainer123");
    console.log("  Student:   user@kkit.com / user123");
    console.log("═══════════════════════════════════════════\n");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedData();
