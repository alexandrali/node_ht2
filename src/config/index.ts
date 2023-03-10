import dotenv from 'dotenv';

const envFound = dotenv.config();

if (envFound.error) {
  throw new Error("Couldn't find .env file");
}

const port = process.env.PORT;
const dbUrl = process.env.DB_URL || '';
const secret = process.env.SECRET || '';

export default {
  port,
  dbUrl,
  secret,
};
