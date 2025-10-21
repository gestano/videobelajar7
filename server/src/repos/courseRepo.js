import { query } from "../db/pool.js";

const columns = [
  "title","category","excerpt","image","authorName","authorRole","price","rating","reviews"
];

export async function findAll({
  search,
  category,
  minRating,
  maxRating,
  minReviews,
  sortBy = "id",
  sortDir = "desc",
} = {}) {
  let sql = "SELECT * FROM courses";
  const where = [];
  const params = {};

  if (search) {
    where.push("(title LIKE :search OR excerpt LIKE :search)");
    params.search = `%${search}%`;
  }
  if (category) {
    where.push("category = :category");
    params.category = category;
  }
  if (minRating !== undefined) {
    where.push("rating >= :minRating");
    params.minRating = Number(minRating);
  }
  if (maxRating !== undefined) {
    where.push("rating <= :maxRating");
    params.maxRating = Number(maxRating);
  }
  if (minReviews !== undefined) {
    where.push("reviews >= :minReviews");
    params.minReviews = Number(minReviews);
  }

  if (where.length) sql += " WHERE " + where.join(" AND ");

  const sortMap = {
    id: "id",
    created_at: "created_at",
    rating: "rating",
    reviews: "reviews",
  };
  const col = sortMap[sortBy] || "id";
  const dir = String(sortDir).toUpperCase() === "ASC" ? "ASC" : "DESC";
  sql += ` ORDER BY ${col} ${dir}`;

  return query(sql, params);
}

export async function findById(id) {
  const rows = await query("SELECT * FROM courses WHERE id = :id", { id });
  return rows[0] || null;
}

export async function create(data) {
  const payload = Object.fromEntries(
    Object.entries(data).filter(([k]) => columns.includes(k))
  );
  const keys = Object.keys(payload);
  const placeholders = keys.map((k) => `:${k}`).join(", ");
  const sql = `INSERT INTO courses (${keys.join(",")}) VALUES (${placeholders})`;
  const res = await query(sql, payload);
  const insertedId = res.insertId || res.lastInsertId;
  return findById(insertedId);
}

export async function updateById(id, data) {
  const updates = Object.fromEntries(
    Object.entries(data).filter(([k, v]) => columns.includes(k) && v !== undefined)
  );
  if (!Object.keys(updates).length) return findById(id);

  const setClause = Object.keys(updates).map((k) => `${k} = :${k}`).join(", ");
  await query(`UPDATE courses SET ${setClause} WHERE id = :id`, { id, ...updates });
  return findById(id);
}

export async function deleteById(id) {
  const res = await query("DELETE FROM courses WHERE id = :id", { id });
  return res.affectedRows > 0;
}