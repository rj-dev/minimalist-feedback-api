const { z } = require("zod");

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // New Email Variables
  MAIL_HOST: z.string(),
  MAIL_PORT: z.coerce.number().default(2525),
  MAIL_USER: z.string(),
  MAIL_PASS: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("❌ Invalid environment variables!", _env.error.format());

  process.exit(1);
  //throw new Error("Invalid environment variables.");
}

module.exports = { env: _env.data };
