import orchestrator from "../orchestrator.js";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "testuser",
          email: "testuser@example.com",
          password: "securepassword123",
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "testuser",
        email: "testuser@example.com",
        password: "securepassword123",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With duplicated 'email'", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emailduplicado",
          email: "duplicado@example.com",
          password: "securepassword123",
        }),
      });

      expect(response1.status).toBe(201);

      const responseBody1 = await response1.json();
      expect(responseBody1).toEqual({
        id: responseBody1.id,
        username: "emailduplicado",
        email: "duplicado@example.com",
        password: "securepassword123",
        created_at: responseBody1.created_at,
        updated_at: responseBody1.updated_at,
      });
      expect(uuidVersion(responseBody1.id)).toBe(4);
      expect(Date.parse(responseBody1.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody1.updated_at)).not.toBeNaN();

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emailduplicado2",
          email: "Duplicado@example.com",
          password: "securepassword123",
        }),
      });

      expect(response2.status).toBe(400);
      const responseBody2 = await response2.json();
      expect(responseBody2).toEqual({
        name: "ValidationError",
        message: "Email already exists",
        action: "Please use a different email address",
        status_code: 400,
      });
    });

    test("With duplicated 'username'", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "usernameduplicado",
          email: "duplicado@example.com",
          password: "securepassword123",
        }),
      });

      expect(response1.status).toBe(201);

      const responseBody1 = await response1.json();
      expect(responseBody1).toEqual({
        id: responseBody1.id,
        username: "usernameduplicado",
        email: "duplicado@example.com",
        password: "securepassword123",
        created_at: responseBody1.created_at,
        updated_at: responseBody1.updated_at,
      });
      expect(uuidVersion(responseBody1.id)).toBe(4);
      expect(Date.parse(responseBody1.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody1.updated_at)).not.toBeNaN();

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "usernameduplicado",
          email: "Duplicado@example.com",
          password: "securepassword123",
        }),
      });

      expect(response2.status).toBe(400);
      const responseBody2 = await response2.json();
      expect(responseBody2).toEqual({
        name: "ValidationError",
        message: "Email already exists",
        action: "Please use a different email address",
        status_code: 400,
      });
    });
  });
});
