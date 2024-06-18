import * as T from "@effect-ts/core/Effect";
import {
  createTaskForUser,
  deleteTaskForUser,
  getUserTasks,
  updateTaskForUser,
} from "../../src/services/taskService";
import { db } from "../../src/database/inMemoryDb";
import { Task } from "../../src/model/task"; 
import { User } from "../../src/model/user";

describe("Task Service", () => {
  beforeEach(() => {
    db.clearUsers(); 
  });

  it("should create a task for a user", async () => {
  
    const userId = "user1";
    db.addUser({ id: userId, name: "Test User", tasks: [] });

    const taskData: Omit<Task, "id"> = {
      title: "Test Task",
      description: "This is a test task",
      dueDate: new Date(),
      status: "To Do",
    };

    const result = await T.runPromise(createTaskForUser(userId, taskData));

    expect(result).toHaveProperty("id");
    expect(result.title).toBe(taskData.title);
    expect(result.description).toBe(taskData.description);
    expect(result.status).toBe(taskData.status);
    expect(db.getUsers()[0].tasks.length).toBe(1); 
  });

  it("should throw an error when user is not found", async () => {
    const userId = "nonexistentUser";
    const taskData: Omit<Task, "id"> = {
      title: "Test Task",
      description: "This is a test task",
      dueDate: new Date(),
      status: "To Do", 
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

describe("getUserTasks", () => {
  beforeEach(() => {
    db.clearUsers();
  });

  it("should fetch tasks for an existing user", async () => {
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

    const user: User = {
      id: userId,
      name: "Test User",
      tasks,
    };
    db.addUser(user);

    const effect = T.runPromise(getUserTasks(userId));
    const resultTasks = await effect;

    expect(resultTasks).toEqual(tasks);
  });

  it("should return empty array for a user with no tasks", async () => {
    const userId = "user1";
    const user: User = {
      id: userId,
      name: "Test User",
      tasks: [],
    };
    db.addUser(user);

    const effect = T.runPromise(getUserTasks(userId));
    const resultTasks = await effect;

    expect(resultTasks).toEqual([]);
  });

  it("should throw an error for a non-existent user", async () => {
    const userId = "nonexistentUser";

    await expect(T.runPromise(getUserTasks(userId))).rejects.toThrowError(
      "User not found"
    );
  });
});


describe("updateTaskForUser", () => {
  beforeEach(() => {
    db.clearUsers();
  });

  it("should update the task for a valid user and task id", async () => {
    const userId = "user1";
    const taskId = "task1";
    const task: Task = {
      id: taskId,
      title: "Test Task",
      description: "This is a test task",
      dueDate: new Date(),
      status: "To Do",
    };
    db.addUser({ id: userId, name: "Test User", tasks: [task] });

    const updatedTask = { title: "Updated Task" };

    const result = await T.runPromise(
      updateTaskForUser(userId, taskId, updatedTask)
    );

    expect(result.title).toBe("Updated Task");
    expect(result.description).toBe("This is a test task");
  });

  it("should throw an error if the user is not found", async () => {
    const userId = "nonexistentUser";
    const taskId = "task1";
    const updatedTask = { title: "Updated Task" };

    await expect(
      T.runPromise(updateTaskForUser(userId, taskId, updatedTask))
    ).rejects.toThrowError("User not found");
  });

  it("should throw an error if the task is not found", async () => {
    const userId = "user1";
    const taskId = "nonexistentTask";
    db.addUser({ id: userId, name: "Test User", tasks: [] });

    const updatedTask = { title: "Updated Task" };

    await expect(
      T.runPromise(updateTaskForUser(userId, taskId, updatedTask))
    ).rejects.toThrowError("Task not found");
  });
});

describe("deleteTaskForUser", () => {
  beforeEach(() => {
    db.clearUsers();
  });

  it("should delete the task for a valid user and task id", async () => {
    const userId = "user1";
    const taskId = "task1";
    const task: Task = {
      id: taskId,
      title: "Test Task",
      description: "This is a test task",
      dueDate: new Date(),
      status: "To Do",
    };
    db.addUser({ id: userId, name: "Test User", tasks: [task] });

    await T.runPromise(deleteTaskForUser(userId, taskId));

    const user = db.getUser(userId);
    expect(user?.tasks).toHaveLength(0);
  });

  it("should throw an error if the user is not found", async () => {
    const userId = "nonexistentUser";
    const taskId = "task1";

    await expect(
      T.runPromise(deleteTaskForUser(userId, taskId))
    ).rejects.toThrowError("User not found");
  });

  it("should throw an error if the task is not found", async () => {
    const userId = "user1";
    const taskId = "nonexistentTask";
    db.addUser({ id: userId, name: "Test User", tasks: [] });

    await expect(
      T.runPromise(deleteTaskForUser(userId, taskId))
    ).rejects.toThrowError("Task not found");
  });
});