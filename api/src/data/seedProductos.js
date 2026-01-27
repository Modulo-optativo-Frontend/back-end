const macbooks = [
	{
		nombre: "MacBook Air",
		descripcion: "Ligero y silencioso para el dia a dia.",
		precio: 899,
		modelo: "Air",
		anio: 2020,
		chip: "M1",
		memoriaRamGb: 8,
		almacenamientoGb: 256,
		condicion: "A",
		enStock: true,
		imagenes: [],
		codigoSku: "MBAIR-M1-2020-8-256-A",
	},
	{
		nombre: "MacBook Pro 14",
		descripcion: "Potencia profesional con gran autonomia.",
		precio: 1499,
		modelo: "Pro 14",
		anio: 2021,
		chip: "M1 Pro",
		memoriaRamGb: 16,
		almacenamientoGb: 512,
		condicion: "A",
		enStock: true,
		imagenes: [],
		codigoSku: "MBPRO14-M1PRO-2021-16-512-A",
	},
	{
		nombre: "MacBook Air",
		descripcion: "Diseno renovado con chip M2.",
		precio: 1199,
		modelo: "Air",
		anio: 2022,
		chip: "M2",
		memoriaRamGb: 8,
		almacenamientoGb: 512,
		condicion: "A",
		enStock: true,
		imagenes: [],
		codigoSku: "MBAIR-M2-2022-8-512-A",
	},
	{
		nombre: "MacBook Pro 16",
		descripcion: "Pantalla grande y rendimiento solido.",
		precio: 1299,
		modelo: "Pro 16",
		anio: 2019,
		chip: "Intel i7",
		memoriaRamGb: 16,
		almacenamientoGb: 512,
		condicion: "B",
		enStock: true,
		imagenes: [],
		codigoSku: "MBPRO16-I7-2019-16-512-B",
	},
];

const buildId = (nombre, anio) => {
	const prefijo = (nombre || "MAC").substring(0, 3).toUpperCase();
	const year = anio ? anio.toString() : "0000";
	return `${prefijo}${year}`;
};

module.exports = {
	macbooks,
	buildId,
};
