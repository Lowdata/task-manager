import * as T from "@effect-ts/core/Effect";
import {
  createTaskForUser,
  getUserTasks,
} from "../../src/services/taskService";
import { db } from "../../src/database/inMemoryDb";
import { Task } from "../../src/model/task"; // Assuming this is where your Task type is defined

describe("Task Service", () => {
  beforeEach(() => {
    db.clearUsers(); // Clear users before each test
  });

  it("should create a task for a user", async () => {
    // Mock user creation for testing
    const userId = "user1";
    db.addUser({ id: userId, name: "Test User", tasks: [] });

    const taskData: Omit<Task, "id"> = {
      title: "Test Task",
      description: "This is a test task",
      dueDate: new Date(),
      status: "To Do", // Correct status value from Task type
    };

    const result = await T.runPromise(createTaskForUser(userId, taskData));

    expect(result).toHaveProperty("id");
    expect(result.title).toBe(taskData.title);
    expect(result.description).toBe(taskData.description);
    expect(result.status).toBe(taskData.status);
    expect(db.getUsers()[0].tasks.length).toBe(1); // Check if task was added to user
  });

  it("should throw an error when user is not found", async () => {
    const userId = "nonexistentUser";
    const taskData: Omit<Task, "id"> = {
      title: "Test Task",
      description: "This is a test task",
      dueDate: new Date(),
      status: "To Do", // Correct status value from Task type
    };

    await expect(
      T.runPromise(createTaskForUser(userId, taskData))
    ).rejects.toThrowError("User not found");
  });

  it("should get tasks for a user", async () => {
    const userId = "user1";
    const tasks: Task[] = [
      {
        id: "task1",
        title: "Task 1",
        description: "Task 1 description",
        dueDate: new Date(),
        status: "To Do",
      },
      {
        id: "task2",
        title: "Task 2",
        description: "Task 2 description",
        dueDate: new Date(),
        status: "In Progress",
      },
    ];
    db.addUser({ id: userId, name: "Test User", tasks });

    const result = await T.runPromise(getUserTasks(userId));

    expect(result.length).toBe(2);
    expect(result[0].title).toBe(tasks[0].title);
    expect(result[1].title).toBe(tasks[1].title);
  });

  it("should throw an error when getting tasks for a non-existing user", async () => {
    const userId = "nonexistentUser";

    await expect(T.runPromise(getUserTasks(userId))).rejects.toThrowError(
      "User not found"
    );
  });
});
