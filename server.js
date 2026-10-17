const app = require("./app");
const env = require("./config/env");
const connectDB = require("./config/db");
const { printBanner, startSpinner } = require("./utils/banner");
const { initSocket } = require("./config/socket");

const fixBadCategoryRefs = async () => {
  const Course = require("./modules/course/course.model");
  const Category = require("./modules/category/category.model");
  const courses = await Course.find({});
  const catMap = {};
  const categories = await Category.find({});
  for (const c of categories) catMap[c.name.toString()] = c._id || c.id;
  let fixed = 0;
  for (const course of courses) {
    const val = course.category;
    if (val && typeof val === "string" && !/^\d+$/.test(val)) {
      const match = catMap[val.toString()];
      if (match) {
        course.category = match;
        await course.save();
        fixed++;
      } else {
        course.category = null;
        await course.save();
        fixed++;
      }
    }
  }
  if (fixed > 0) console.log(`  Fixed ${fixed} course(s) with invalid category references`);
};

const startServer = async () => {
  const stopSpinner = startSpinner("Connecting to MySQL / MariaDB...");
  const dbHost = await connectDB();
  stopSpinner();

  try { await fixBadCategoryRefs(); } catch (e) { console.error("Category fix skipped:", e.message); }

  const server = app.listen(env.PORT, async () => {
    initSocket(server);
    await printBanner({
      port: env.PORT,
      env:  env.NODE_ENV || "development",
      mongoHost: dbHost || "localhost",
    });
  });

  process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err.message);
    server.close(() => process.exit(1));
  });

  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err.message);
    server.close(() => process.exit(1));
  });
};

startServer();
