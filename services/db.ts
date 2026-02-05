import { PGlite } from "@electric-sql/pglite";
import { PRODUCTS } from "../data";

let dbInstance: PGlite | null = null;

export const getDB = async () => {
  if (dbInstance) return dbInstance;
  
  try {
    // Initialize PGlite with IndexedDB persistence
    console.log("Initializing PGlite...");
    dbInstance = new PGlite('idb://verixa-db');
    
    // Explicitly wait for the database to be ready
    await dbInstance.waitReady;
    console.log("PGlite Ready");
    
    return dbInstance;
  } catch (err) {
    console.error("Failed to initialize PGlite:", err);
    throw err;
  }
};

export const initDB = async () => {
  try {
    const db = await getDB();
    
    // Create Tables
    await db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        images TEXT[], 
        sizes TEXT[],
        colors TEXT[],
        is_new BOOLEAN DEFAULT FALSE,
        rating DECIMAL(2, 1),
        review_count INTEGER
      );

      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        customer_email TEXT,
        customer_name TEXT,
        total_amount DECIMAL(10, 2),
        status TEXT DEFAULT 'pending'
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id TEXT REFERENCES orders(id),
        product_id TEXT REFERENCES products(id),
        quantity INTEGER,
        selected_size TEXT,
        selected_color TEXT,
        price_at_purchase DECIMAL(10, 2)
      );
    `);

    // Seed Data if empty
    const countResult = await db.query<{ count: number }>('SELECT COUNT(*) as count FROM products');
    if (parseInt(String(countResult.rows[0].count)) === 0) {
      console.log("Seeding Database...");
      for (const p of PRODUCTS) {
        await db.query(
          `INSERT INTO products (id, name, price, category, description, images, sizes, colors, is_new, rating, review_count)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [
            p.id,
            p.name,
            p.price,
            p.category,
            p.description,
            p.images, // PGlite handles JS arrays -> Postgres Arrays
            p.sizes,
            p.colors,
            p.isNew || false,
            p.rating || 0,
            p.reviewCount || 0
          ]
        );
      }
    }
    
    console.log("Database initialized and connected via PGlite (WASM).");
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error; // Re-throw to be caught by App.tsx
  }
};