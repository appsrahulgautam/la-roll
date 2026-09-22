import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  numeric,
  index,
  unique,
  primaryKey,
  serial,
  jsonb,
  pgEnum,
  bigint,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

//Todo This is schema for any table you want. for ex an admin for admin panel
export const adminRoleEnum = pgEnum("admin_role", [
  "super-admin",
  "admin",
  "developer",
]);

export const admins = pgTable("admins", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  role: adminRoleEnum("role").notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  message: varchar("message").notNull(),
  avatar: varchar("avatar").notNull(),
  likes: integer("likes").notNull().default(0),
  hearts: integer("hearts").notNull().default(0),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});
