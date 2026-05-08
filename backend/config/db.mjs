import mysql from 'mysql2';

const db = mysql.createConnection({
  host: '187.77.114.65',
  user: 'mahar',
  password: 'mahar1416',
  database: 'cutz'
});

db.connect((err) => {
  if (err) {
    console.error('Gagal konek ke MySQL:', err);
    return;
  }
  console.log('Terhubung ke database MySQL!');
});

export default db;