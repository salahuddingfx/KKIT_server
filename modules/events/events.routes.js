const express = require("express");
const router = express.Router();
const appEventEmitter = require("../../utils/sseEmitter");

// Public Server-Sent Events (SSE) stream endpoint for real-time updates (no socket.io needed)
router.get("/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // Ensures zero Nginx proxy buffering on Hostinger KVM VPS

  // Initial connection event
  res.write(`data: ${JSON.stringify({ type: "connected", timestamp: new Date().toISOString() })}\n\n`);

  const onRealtimeEvent = (eventData) => {
    res.write(`data: ${JSON.stringify(eventData)}\n\n`);
  };

  appEventEmitter.on("realtime_event", onRealtimeEvent);

  // Keep-alive heartbeat every 25 seconds
  const heartbeat = setInterval(() => {
    res.write(": heartbeat\n\n");
  }, 25000);

  req.on("close", () => {
    clearInterval(heartbeat);
    appEventEmitter.removeListener("realtime_event", onRealtimeEvent);
  });
});

module.exports = router;
