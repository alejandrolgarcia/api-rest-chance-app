
// PUERTO
process.env.PORT = process.env.PORT || 3000;

// ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Vencimiento del token
process.env.CADUCIDAD_TOKEN = '48h';

// SEED de autenticación
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ==================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/chance-api-db';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;