const logger = require("../config/logger");

const errorHandler = (err, req, res, next) => {
	const requestLogger = req.log || logger;
	const statusCode = err.statusCode || err.status || 500;

	requestLogger.error(
		{
			requestId: req.requestId,
			message: err.message,
			stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
		},
		"Unhandled error",
	);

	if (res.headersSent) {
		return next(err);
	}

	return res.status(statusCode).json({
		status: "error",
		message: err.message || "Error interno del servidor",
		requestId: req.requestId,
	});
};

module.exports = errorHandler;
