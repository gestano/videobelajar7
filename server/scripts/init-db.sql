-- Database
CREATE DATABASE IF NOT EXISTS videobelajar
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE videobelajar;

-- Tabel: courses
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  category VARCHAR(60) NOT NULL,
  excerpt TEXT,
  image VARCHAR(255),
  authorName VARCHAR(120),
  authorRole VARCHAR(120),
  price VARCHAR(40) DEFAULT 'Rp 0',
  rating DECIMAL(3,1) DEFAULT 0,
  reviews INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed data courses
INSERT INTO courses (title, category, excerpt, image, authorName, authorRole, price, rating, reviews) VALUES
('React Fundamentals','Teknologi','Pelajari komponen, props, state, dan hooks untuk membangun UI modern.','/images/react-fundamentals.jpg','Dimas Saputra','Frontend Engineer','Rp 250K',4.7,210),
('Python for Data Science','Teknologi','Numpy, Pandas, dan visualisasi data untuk analis pemula.','/images/python-data.jpg','Ayu Pratiwi','Data Scientist','Rp 350K',4.8,156);

-- Tabel: users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullname VARCHAR(120) NOT NULL,
  username VARCHAR(60) NOT NULL,
  email VARCHAR(160) NOT NULL,
  password_hash VARCHAR(200) NOT NULL,
  verify_token VARCHAR(64) DEFAULT NULL,
  email_verified_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_username (username),
  INDEX idx_users_email (email),
  INDEX idx_users_verify_token (verify_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;