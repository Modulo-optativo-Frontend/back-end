const roles = ["admin", "customer"];

function validarRole(res, req, next, roles) {
	if (!roles.includes(req.user.role)) {
		return res.status(403).json({ message: "Accés prohibit" });
	}
	next();
}

function soloAdmin(res, req, next, roles) {
	if (roles["admin"] != req.user.role) {
		return res.status(403).json({ message: "No tiene permisos" });
	}
	next();
}

module.exports = {
	validarRole,
	soloAdmin,
};
