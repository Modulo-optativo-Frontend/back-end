const express = require("express");
const mongoose = require("mongoose");
const { auth } = require("../middleware/auth");
const { soloAdmin } = require("../middleware/roleMiddle");

const router = express.Router();

router.get("/health", (req, res) => {
	const mongoStatus = mongoose.connection.readyState;

	res.json({
		status: "ok",
		uptime: process.uptime(),
		timestamp: new Date().toISOString(),
		database: mongoStatus === 1 ? "connected" : "disconnected",
	});
});

router.get("/metrics", auth, soloAdmin, (req, res) => {
	const memoryUsage = process.memoryUsage();

	res.json({
		uptime: process.uptime(),
		memory: {
			rss: memoryUsage.rss,
			heapTotal: memoryUsage.heapTotal,
			heapUsed: memoryUsage.heapUsed,
			external: memoryUsage.external,
			arrayBuffers: memoryUsage.arrayBuffers,
		},
		cpu: process.cpuUsage(),
		nodeVersion: process.version,
		environment: process.env.NODE_ENV || "development",
	});
});

module.exports = router;
