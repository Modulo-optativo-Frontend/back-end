const observableErrors = (req, res, next) => {
	const originalJson = res.json.bind(res);

	res.json = (body) => {
		if (
			res.statusCode >= 400 &&
			body &&
			typeof body === "object" &&
			!Array.isArray(body) &&
			!body.requestId
		) {
			return originalJson({ ...body, requestId: req.requestId });
		}

		return originalJson(body);
	};

	next();
};

module.exports = observableErrors;
