const initSentry = (app) => {
  if (process.env.NODE_ENV !== "production" || !process.env.SENTRY_DSN) {
    return;
  }

  try {
    const Sentry = require("@sentry/node");

    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || "development",
      tracesSampleRate: 0.1,
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.Express({ app }),
      ],
    });

    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.tracingHandler());

    console.log("Sentry initialized");
  } catch (error) {
    console.error("Sentry initialization failed:", error.message);
  }
};

const SentryErrorHandler = (app) => {
  if (process.env.NODE_ENV !== "production" || !process.env.SENTRY_DSN) {
    return;
  }

  try {
    const Sentry = require("@sentry/node");
    app.use(Sentry.Handlers.errorHandler());
  } catch (error) {
    // silent fail
  }
};

module.exports = { initSentry, SentryErrorHandler };
