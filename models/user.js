import database from "infra/database.js";
import { NotFoundError, ValidationError } from "infra/errors.js";

async function findOneByUserName(userName) {
  const result = await runSelectQuery(userName);
  return result;

  async function runSelectQuery(userName) {
    const results = await database.query({
      text: `
      SELECT
        *
      FROM
        users
      WHERE
        LOWER(username) = LOWER($1)
      LIMIT 
        1
      ;`,
      values: [userName],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "User not found",
        action: "Please check the username and try again",
      });
    }
    return results.rows[0];
  }
}

async function create(username, email, password) {
  await validateUniqueUserName(username);
  await validateUniqueEmail(email);

  const newUser = await runInsertQuery(username, email, password);
  return newUser;

  async function validateUniqueUserName(username) {
    const result = await database.query({
      text: `
      SELECT
        username
      FROM
        users
      WHERE
        LOWER(username) = LOWER($1)
      ;`,
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
      text: `
      SELECT
        email
      FROM
        users
      WHERE
        LOWER(email) = LOWER($1)
      ;`,
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
      text: `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      values: [username, email, password],
    });
    return result.rows[0];
  }
}

const user = {
  create,
  findOneByUserName,
};

export default user;
