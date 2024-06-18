import request from "supertest";
import app from "../../src/app";
import { User } from "../../src/model/user";
import { Task } from "../../src/model/task";
import { db } from "../../src/database/inMemoryDb";

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
      .post("/users/nonExistentUserId/tasks")
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


describe("GET /users/:user_id/tasks", () => {
  
  it("should return 400 for non-existent user", async () => {
    const userId = "non_existent_user_id"; 
    const response = await request(app).get(`/users/${userId}/tasks`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "User not found");
  });
});


describe("PUT /users/:user_id/tasks/:task_id", () => {
  beforeEach(() => {
    db.clearUsers();
    const initialUser: User = {
      id: "tkiiodziAJQvKHm3jDuva",
      name: "ayush",
      tasks: [
        {
          id: "66fBHEgoHmN9Njtn3gafX9",
          title: "Test Task",
          description: "This is a test task",
          dueDate: new Date(),
          status: "To Do",
        },
      ],
    };
    db.addUser(initialUser);
  });

  it("should return 400 for non-existent user", async () => {
    const userId = "non_existent_user_id";
    const taskId = "task1";
    const updatedTask = {
      title: "Updated Task",
      description: "This is an updated test task",
      dueDate: new Date(),
      status: "In Progress",
    };

    const response = await request(app)
      .put(`/users/${userId}/tasks/${taskId}`)
      .send(updatedTask);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Task not found");
  });

  it("should return 400 for non-existent task", async () => {
    const userId = "tkiiodziAJQvKHm3jDuva";
    const taskId = "non_existent_task_id";
    const updatedTask = {
      title: "Updated Task",
      description: "This is an updated test task",
      dueDate: new Date(),
      status: "In Progress",
    };

    const response = await request(app)
      .put(`/users/${userId}/tasks/${taskId}`)
      .send(updatedTask);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Task not found");
  });
});


describe("DELETE /users/:user_id/tasks/:task_id", () => {
  beforeEach(() => {
    db.clearUsers();
    const initialUser: User = {
      id: "tkiiodziAJQvKHm3jDuva",
      name: "ayush",
      tasks: [
        {
          id: "66fBHEgoHmN9Njtn3gafX9",
          title: "Test Task",
          description: "This is a test task",
          dueDate: new Date(),
          status: "To Do",
        },
      ],
    };
    db.addUser(initialUser);
  });


  it("should return 400 for non-existent user", async () => {
    const userId = "non_existent_user_id";
    const taskId = "task1";

    const response = await request(app).delete(
      `/users/${userId}/tasks/${taskId}`
    );

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Task not found");
  });

  it("should return 400 for non-existent task", async () => {
    const userId = "tkiiodziAJQvKHm3jDuva";
    const taskId = "non_existent_task_id";

    const response = await request(app).delete(
      `/users/${userId}/tasks/${taskId}`
    );

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Task not found");
  });
});