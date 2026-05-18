const pinoHttp = require("pino-http");
const logger = require("../config/logger");

const httpLogger = pinoHttp({
	logger,
	genReqId(req) {
		return req.requestId;
	},
	customProps(req) {
		return {
			requestId: req.requestId,
			userId: req.user?.id || req.user?.userId || null,
		};
	},
	customLogLevel(req, res, err) {
		if (res.statusCode >= 500 || err) return "error";
		if (res.statusCode >= 400) return "warn";
		return "info";
	},
	customSuccessMessage(req, res) {
		return `${req.method} ${req.url} completed with status ${res.statusCode}`;
	},
	customErrorMessage(req, res) {
		return `${req.method} ${req.url} failed with status ${res.statusCode}`;
	},
});

module.exports = httpLogger;
