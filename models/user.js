import database from "infra/database.js";
import { ValidationError } from "infra/errors.js";

async function create(username, email, password) {
  await validateUniqueUserName(username);
  await validateUniqueEmail(email);

  const newUser = await runInsertQuery(username, email, password);
  return newUser;

  async function validateUniqueUserName(username) {
    const result = await database.query({
      text: `SELECT id FROM users WHERE LOWER(username) = LOWER($1);`,
      values: [username],
    });

    if (result.rowCount > 0) {
      throw new ValidationError({
        message: "Username already exists",
        action: "Please use a different username",
      });
    }
  }

  async function validateUniqueEmail(email) {
    const result = await database.query({
      text: `SELECT id FROM users WHERE LOWER(email) = LOWER($1);`,
      values: [email],
    });

    if (result.rowCount > 0) {
      throw new ValidationError({
        message: "Email already exists",
        action: "Please use a different email address",
      });
    }
  }

  async function runInsertQuery(username, email, password) {
    const result = await database.query({
      text: `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;`,
      values: [username, email, password],
    });
    return result[0];
  }
}

const user = {
  create,
};

export default user;
