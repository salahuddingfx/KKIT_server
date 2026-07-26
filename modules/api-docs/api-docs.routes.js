const express = require("express");
const router = express.Router();
const { getDocsHTML } = require("./api-docs.controller");

router.get("/", getDocsHTML);

module.exports = router;
