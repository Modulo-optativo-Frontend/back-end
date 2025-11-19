function auth(req, res, next) {
	const valor = req.headers.auth;

	if (!valor) {
		res.status(401).json({ status: "Error", message: "Token requerido" });
        return;
	}

    
}
