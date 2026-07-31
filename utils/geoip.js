"use strict";

/**
 * IP Geolocation & User-Agent Parser Utility
 */

const getClientIp = (req) => {
  if (!req) return "127.0.0.1";
  const cfIp = req.headers["cf-connecting-ip"];
  if (cfIp) return String(cfIp).split(",")[0].trim();

  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) return String(forwarded).split(",")[0].trim();

  const realIp = req.headers["x-real-ip"];
  if (realIp) return String(realIp).trim();

  return req.ip || req.connection?.remoteAddress || "127.0.0.1";
};

const resolveGeoLocation = (req, ip) => {
  // Check Cloudflare headers if available
  const cfCountry = req?.headers["cf-ipcountry"];
  if (cfCountry && cfCountry !== "XX") {
    const countryNames = {
      BD: "Bangladesh",
      US: "United States",
      GB: "United Kingdom",
      IN: "India",
      CA: "Canada",
      AU: "Australia",
      DE: "Germany",
      AE: "United Arab Emirates",
      SA: "Saudi Arabia",
      SG: "Singapore",
      JP: "Japan",
    };
    const code = String(cfCountry).toUpperCase();
    return {
      country: countryNames[code] || code,
      countryCode: code,
      city: req?.headers["cf-ipcity"] ? String(req.headers["cf-ipcity"]) : "Main Region",
    };
  }

  // Local / Development IP Handling
  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    return {
      country: "Bangladesh",
      countryCode: "BD",
      city: "Dhaka",
    };
  }

  return {
    country: "Bangladesh",
    countryCode: "BD",
    city: "Dhaka",
  };
};

const parseUserAgent = (uaString = "") => {
  const ua = uaString.toLowerCase();

  let browser = "Other";
  if (ua.includes("edg/")) browser = "Microsoft Edge";
  else if (ua.includes("chrome") && !ua.includes("chromium")) browser = "Google Chrome";
  else if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari";
  else if (ua.includes("firefox")) browser = "Firefox";
  else if (ua.includes("opera") || ua.includes("opr/")) browser = "Opera";

  let os = "Other";
  if (ua.includes("win")) os = "Windows";
  else if (ua.includes("mac")) os = "macOS";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) os = "iOS";
  else if (ua.includes("linux")) os = "Linux";

  let device = "Desktop";
  if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) device = "Mobile";
  else if (ua.includes("ipad") || ua.includes("tablet")) device = "Tablet";

  return { browser, os, device };
};

module.exports = {
  getClientIp,
  resolveGeoLocation,
  parseUserAgent,
};
