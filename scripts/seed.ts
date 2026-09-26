import "dotenv/config"; 

import { db } from "../lib/db-node";
import { admins } from "../db/schema";
import bcrypt from "bcryptjs";

async function main() {
  const hashed = await bcrypt.hash("Laroll@99799030", 10);

  await db.insert(admins).values({
    id: crypto.randomUUID(),
    email: "underrated.oman@gmail.com",
    password: hashed,
  });

  console.log("✅ Admin created");
}

main();
