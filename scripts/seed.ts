import "dotenv/config"; 

import { db } from "../lib/db-node";
import { admins } from "../db/schema";
import bcrypt from "bcryptjs";

async function main() {
  const hashed = await bcrypt.hash("admin1234", 10);

  await db.insert(admins).values({
    id: crypto.randomUUID(),
    email: "admin@gmail.com",
    password: hashed,
  });

  console.log("✅ Admin created");
}

main();
