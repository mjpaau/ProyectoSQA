const sql = require('mssql');

const config = {
    user: 'reservago', // Reemplaza 'reservago' con tu nombre de usuario
    password: 'Razkids080517', // Reemplaza 'TuContraseña' con tu contraseña real
    server: 'reservagobd.database.windows.net',
    port: 1433,
    database: 'reservago_database',
    options: {
        encrypt: true,
        trustServerCertificate: false,
    },
    connectionTimeout: 30000,
};

let connectionPool;

// Función para obtener la conexión a la base de datos
async function getConnection() {
    try {
        if (connectionPool) return connectionPool;
        connectionPool = await sql.connect(config);
        return connectionPool;
    } catch (error) {
        console.error("Error al conectar a la base de datos", error);
        throw error;
    }
}

module.exports = {
    getConnection
};
