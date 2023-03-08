import mysql from 'mysql';

export const database = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "test123",
  database: "blog"
});