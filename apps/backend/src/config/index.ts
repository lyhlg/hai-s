import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../../.env") });

function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  db: {
    host: required("DB_HOST"),
    port: parseInt(process.env.DB_PORT || "3306", 10),
    user: required("DB_USER"),
    password: required("DB_PASSWORD"),
    name: required("DB_NAME"),
  },
  jwt: {
    secret: required("JWT_SECRET"),
    expiresIn: "16h",
  },
  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS || "10", 10),
  },
};
