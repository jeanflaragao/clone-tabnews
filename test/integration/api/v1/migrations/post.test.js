import database from "infra/database.js";

async function resetDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

beforeAll(resetDatabase);

test("POST /api/v1/migrations should returns status 200 ", async () => {
  const response1 = await fetch("http://localhost:3000/api/v1/migrations",
    { method: "POST" }
  );
  expect(response1.status).toBe(201);

  const response1Body = await response1.json();
  expect(Array.isArray(response1Body)).toBe(true);
  expect(response1Body.length).toBeGreaterThan(0);

  const response2Body = await fetch("http://localhost:3000/api/v1/migrations",
    { method: "POST" }
  );
  expect(response2Body.status).toBe(200);

  const response2BodyBody = await response2Body.json();
  expect(Array.isArray(response2BodyBody)).toBe(true);
});