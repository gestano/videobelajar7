import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT || 3306),
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true
});

export async function query(sql, params = {}) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}