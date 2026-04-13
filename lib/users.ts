import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  totpSecret: string | null;
  totpEnabled: boolean;
  createdAt: number;
}

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readUsers(): User[] {
  try {
    ensureDir();
    if (!fs.existsSync(USERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeUsers(users: User[]) {
  ensureDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export function getUserByEmail(email: string): User | null {
  return readUsers().find((u) => u.email === email.toLowerCase()) ?? null;
}

export function getUserById(id: string): User | null {
  return readUsers().find((u) => u.id === id) ?? null;
}

export function createUser(email: string, passwordHash: string): User {
  const users = readUsers();
  const user: User = {
    id: randomUUID(),
    email: email.toLowerCase(),
    passwordHash,
    totpSecret: null,
    totpEnabled: false,
    createdAt: Date.now(),
  };
  users.push(user);
  writeUsers(users);
  return user;
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updates };
  writeUsers(users);
  return users[idx];
}
