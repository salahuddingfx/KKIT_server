const mongoose = require("mongoose");
const env = require("./src/config/env");
const User = require("./src/modules/user/user.model");
const bcrypt = require("bcryptjs");

async function checkPass() {
  await mongoose.connect(env.MONGODB_URI);
  const user = await User.findOne({ email: "test3@example.com" }).select("+password");
  console.log("Hashed password in DB:", user.password);
  const isMatch = await bcrypt.compare("anotherpassword123", user.password);
  console.log("Does anotherpassword123 match?", isMatch);
  await mongoose.disconnect();
}
checkPass().catch(console.error);