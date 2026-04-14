import "server-only";

import crypto from "crypto";
import { getDatabase } from "./mongodb";

export type AdminDocument = {
  email: string;
  passwordHash: string;
  role: "admin";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
};

const ADMIN_COLLECTION = "admins";
const HASH_KEY_LENGTH = 64;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  return EMAIL_PATTERN.test(normalizeEmail(email));
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, HASH_KEY_LENGTH).toString("hex");

  return `${salt}:${derivedKey}`;
}

export function verifyPassword(password: string, passwordHash: string) {
  const [salt, storedHash] = passwordHash.split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const candidateHash = crypto.scryptSync(password, salt, HASH_KEY_LENGTH);
  const storedHashBuffer = Buffer.from(storedHash, "hex");

  if (candidateHash.length !== storedHashBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(candidateHash, storedHashBuffer);
}

async function getAdminCollection() {
  const database = await getDatabase();
  const collection = database.collection<AdminDocument>(ADMIN_COLLECTION);

  await collection.createIndex({ email: 1 }, { unique: true });

  return collection;
}

export async function findAdminByEmail(email: string) {
  const collection = await getAdminCollection();
  return collection.findOne({ email: normalizeEmail(email) });
}

export async function createAdmin(email: string, password: string) {
  const collection = await getAdminCollection();
  const now = new Date();
  const admin: AdminDocument = {
    email: normalizeEmail(email),
    passwordHash: hashPassword(password),
    role: "admin",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(admin);

  return {
    _id: result.insertedId,
    email: admin.email,
    role: admin.role,
    isActive: admin.isActive,
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
  };
}

export async function updateAdminLastLogin(email: string) {
  const collection = await getAdminCollection();
  await collection.updateOne(
    { email: normalizeEmail(email) },
    {
      $set: {
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      },
    }
  );
}
