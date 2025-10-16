// Importar la librería mongoose per conectar amb MongoDB
const mongoose = require("mongoose");

// Funció asíncrona per connectar a la base de dades
const connectDB = async () => {
	try {
		// Connectar a MongoDB utilitzant la URI de l'arxiu d'entorn
		await mongoose.connect(process.env.MONGO_URI);
		// Mostrar missatge d'èxit per consola
		console.log("MongoDB connectat correctament");
	} catch (err) {
		// Mostrar error per consola si la connexió falla
		console.error(err.message);
		// Terminar el procés amb codi d'error
		process.exit(1);
	}
};
// Exportar la funció per utilitzar-la en altres arxius
module.exports = connectDB;
