import request from "supertest";
import app from "../../src/app";
import { User } from "../../src/model/user";
import { Task } from "../../src/model/task";

describe("Task API", () => {
  let user: User;

  beforeAll(async () => {
    const response = await request(app).post("/users?name=TestUser").send();
    user = response.body;
  });

  it("should create a task for the specified user", async () => {
    const task: Task = {
      id: "",
      title: "New Task",
      description: "Task description",
      dueDate: new Date(),
      status: "To Do",
    };

    const response = await request(app)
      .post(`/users/${user.id}/tasks`)
      .send(task);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("title", "New Task");
    expect(response.body).toHaveProperty("description", "Task description");
    expect(response.body).toHaveProperty("status", "To Do");
  });

  it("should fail to create a task for a non-existent user", async () => {
    const task: Task = {
      id: "",
      title: "New Task",
      description: "Task description",
      dueDate: new Date(),
      status: "To Do",
    };

    const response = await request(app)
      .post(`/users/nonExistentUserId/tasks`)
      .send(task);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "User not found");
  });

  it("should return 404 for invalid endpoint", async () => {
    const response = await request(app).post("/invalid-endpoint").send();
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Invalid endpoint");
  });
});
