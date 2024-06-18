import app from "../../src/app";
import request from "supertest";

describe("User API", () => {
  it("should create a user", async () => {
    const response = await request(app).post("/users?name=JohnDoe").send();
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name", "JohnDoe");
    expect(response.body).toHaveProperty("tasks", []);
  });

  it("should create a user with tasks", async () => {
    const tasks = [
      {
        id: "1",
        title: "Task 1",
        description: "Task description",
        dueDate: new Date().toISOString(),
        status: "To Do",
      },
    ];

    const response = await request(app)
      .post("/users?name=JaneDoe")
      .send({ tasks });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name", "JaneDoe");
    expect(response.body.tasks).toEqual(tasks);
  });

  it("should fail to create a user without a name", async () => {
    const response = await request(app).post("/users").send();
    expect(response.status).toBe(400); // Expecting 400 status for bad request
    expect(response.body).toHaveProperty(
      "message",
      "User creation failed: enter name"
    );
  });

  it("should return 404 for invalid endpoint", async () => {
    const response = await request(app).post("/invalid-endpoint").send();
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Invalid endpoint");
  });
});