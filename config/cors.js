const env = require("./env");

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [env.CLIENT_URL, env.ADMIN_URL];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-App-Context", "x-app-context"],
  exposedHeaders: ["X-Total-Count"],
  maxAge: 86400,
};

module.exports = corsOptions;
