import { Router } from "express";
import { z } from "zod";
import * as repo from "../repos/courseRepo.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

const listSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  maxRating: z.coerce.number().min(0).max(5).optional(),
  minReviews: z.coerce.number().int().min(0).optional(),
  sortBy: z.enum(["id", "created_at", "rating", "reviews"]).optional().default("id"),
  sortDir: z.enum(["asc", "ASC", "desc", "DESC"]).optional().default("desc"),
});

const createSchema = z.object({
  title: z.string().min(1, "title wajib"),
  category: z.string().min(1, "category wajib"),
  excerpt: z.string().optional().default(""),
  image: z.string().optional(),
  authorName: z.string().optional(),
  authorRole: z.string().optional(),
  price: z.string().optional().default("Rp 0"),
  rating: z.number().min(0).max(5).optional().default(0),
  reviews: z.number().int().min(0).optional().default(0)
});

const updateSchema = createSchema.partial();

router.get("/", async (req, res, next) => {
  try {
    const params = listSchema.parse(req.query);
    const data = await repo.findAll(params);
    res.json(data);
  } catch (e) { next(e); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const data = await repo.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json(data);
  } catch (e) { next(e); }
});

// proteksi create/update/delete
router.post("/", verifyToken, async (req, res, next) => {
  try {
    const payload = createSchema.parse(req.body);
    const created = await repo.create(payload);
    res.status(201).json(created);
  } catch (e) { next(e); }
});

router.patch("/:id", verifyToken, async (req, res, next) => {
  try {
    const payload = updateSchema.parse(req.body);
    const updated = await repo.updateById(req.params.id, payload);
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (e) { next(e); }
});

router.put("/:id", verifyToken, async (req, res, next) => {
  try {
    const payload = updateSchema.parse(req.body);
    const updated = await repo.updateById(req.params.id, payload);
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (e) { next(e); }
});

router.delete("/:id", verifyToken, async (req, res, next) => {
  try {
    const ok = await repo.deleteById(req.params.id);
    if (!ok) return res.status(404).json({ message: "Not found" });
    res.status(204).send();
  } catch (e) { next(e); }
});

export default router;