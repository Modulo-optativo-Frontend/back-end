const roles = ["admin", "customer"];

function validarRole(req, res, next) {
	if (!req.user || !roles.includes(req.user.role)) {
		return res.status(403).json({ message: "Accés prohibit" });
	}
	next();
}

function soloAdmin(req, res, next) {
	if (!req.user || req.user.role !== "admin") {
		return res.status(403).json({ message: "No tiene permisos" });
	}
	next();
}

module.exports = {
	validarRole,
	soloAdmin,
};
