/**
 * @swagger
 * /api/auth/login:
 * post:
 * summary: Login d'usuari
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * email:
 * type: string
 * password:
 * type: string
 * responses:
 * 200:
 * description: Login correcte
 * 401:
 * description: Credencials incorrectes
 */

const process = require("process");
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return res
			.status(401)
			.json({ status: "error", message: "Token requerido" });
	}

	const partes = authHeader.split(" ");
	const schema = partes[0];
	const token = partes[1];

	if (schema !== "Bearer" || token == null) {
		return res
			.status(401)
			.json({ status: "Error", message: "Formato inválido" });
	}

	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		req.user = payload;
		next();
	} catch (errorTry) {
		res.status(401).json({ status: "Error", message: "Token inválido" });
	}
}

module.exports = {
	auth,
};
