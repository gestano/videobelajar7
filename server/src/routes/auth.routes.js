import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import * as users from "../repos/userRepo.js";
import { sendVerificationEmail } from "../services/mailer.js";

const router = Router();

const registerSchema = z.object({
  fullname: z.string().min(1, "fullname wajib"),
  username: z.string().min(3).regex(/^[a-zA-Z0-9_]+$/, "username hanya huruf/angka/underscore"),
  email: z.string().email(),
  password: z.string().min(6, "password min 6 karakter"),
});

router.post("/register", async (req, res, next) => {
  try {
    const { fullname, username, email, password } = registerSchema.parse(req.body);
    const normalizedEmail = email.toLowerCase().trim();

    if (await users.findByEmail(normalizedEmail)) {
      return res.status(409).json({ message: "Email sudah terdaftar" });
    }
    if (await users.findByUsername(username)) {
      return res.status(409).json({ message: "Username sudah dipakai" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const verify_token = uuidv4();

    const created = await users.create({
      fullname,
      username,
      email: normalizedEmail,
      password_hash,
      verify_token,
    });

    // kirim email verifikasi
    await sendVerificationEmail(normalizedEmail, verify_token);

    res.status(201).json({
      message: "Registrasi berhasil. Cek email untuk verifikasi.",
      user: users.toPublic(created),
    });
  } catch (e) {
    next(e);
  }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await users.findByEmail(email.toLowerCase().trim());

    // 401 Unauthorized bila kredensial salah
    if (!user) return res.status(401).json({ message: "Email atau password salah" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: "Email atau password salah" });

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username, fullname: user.fullname },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ // OK
      token,
      user: users.toPublic(user),
    });
  } catch (e) {
    next(e);
  }
});

router.get("/verify-email", async (req, res, next) => {
  try {
    const token = String(req.query.token || "");
    if (!token) return res.status(400).json({ message: "Token diperlukan" });

    const user = await users.findByVerifyToken(token);
    if (!user) return res.status(400).json({ message: "Invalid Verification Token" });

    await users.markEmailVerified(user.id);
    res.json({ message: "Email Verified Successfully" });
  } catch (e) {
    next(e);
  }
});

export default router;