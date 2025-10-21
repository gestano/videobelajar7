import { query } from "../db/pool.js";

export async function findById(id) {
  const rows = await query("SELECT * FROM users WHERE id = :id", { id });
  return rows[0] || null;
}

export async function findByEmail(email) {
  const rows = await query("SELECT * FROM users WHERE email = :email LIMIT 1", { email });
  return rows[0] || null;
}

export async function findByUsername(username) {
  const rows = await query("SELECT * FROM users WHERE username = :username LIMIT 1", { username });
  return rows[0] || null;
}

export async function findByVerifyToken(token) {
  const rows = await query("SELECT * FROM users WHERE verify_token = :token LIMIT 1", { token });
  return rows[0] || null;
}

export async function create({ fullname, username, email, password_hash, verify_token }) {
  const sql = `
    INSERT INTO users (fullname, username, email, password_hash, verify_token)
    VALUES (:fullname, :username, :email, :password_hash, :verify_token)
  `;
  const res = await query(sql, { fullname, username, email, password_hash, verify_token });
  const id = res.insertId || res.lastInsertId;
  return findById(id);
}

export async function markEmailVerified(id) {
  await query(
    "UPDATE users SET verify_token = NULL, email_verified_at = CURRENT_TIMESTAMP WHERE id = :id",
    { id }
  );
  return findById(id);
}

export function toPublic(user) {
  if (!user) return null;
  const { password_hash, verify_token, ...safe } = user;
  return safe;
}