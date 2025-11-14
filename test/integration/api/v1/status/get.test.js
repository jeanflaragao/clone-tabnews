import orchestrator from "../orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("GET /api/v1/status should returns status 200 ", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.update_at).toBeDefined();
  const parsedDate = Date.parse(responseBody.update_at);
  expect(responseBody.update_at).toBe(new Date(parsedDate).toISOString());
});