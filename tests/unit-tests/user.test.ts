"use strict";

import { createUser } from "../../src/services/userService";
import * as T from "@effect-ts/core/Effect";
import { pipe } from "@effect-ts/core/Function";
import { User } from "../../src/model/user";
import { Task } from "../../src/model/task";
import { db } from "../../src/database/inMemoryDb";

describe("userService", () => {
  beforeEach(() => {
    db.clearUsers(); // Clear the users before each test
  });

  it("should create a user", async () => {
    const result: T.Effect<unknown, Error, User> = pipe(
      createUser("John Doe"),
      T.chain((user) =>
        T.succeedWith(() => {
          console.log("User created:", user); // Log the user object
          return user;
        })
      ) 
    );

    const userOrError = await T.runPromise(result);

    expect(userOrError).toHaveProperty("id");
    expect(userOrError).toHaveProperty("name", "John Doe");
    expect(userOrError).toHaveProperty("tasks", []);
  });

  it("should create a user with tasks", async () => {
    const tasks: Task[] = [
      {
        id: "1",
        title: "Task 1",
        description: "Task description",
        dueDate: new Date(),
        status: "To Do",
      },
    ];

    const result: T.Effect<unknown, Error, User> = pipe(
      createUser("Jane Doe", tasks),
      T.chain((user) =>
        T.succeedWith(() => {
          console.log("User created:", user); // Log the user object
          return user;
        })
      ) 
    );

    const userOrError = await T.runPromise(result);

    expect(userOrError).toHaveProperty("id");
    expect(userOrError).toHaveProperty("name", "Jane Doe");
    expect(userOrError.tasks).toEqual(tasks);
  });

  it("should fail to create a user without a name", async () => {
    const result: T.Effect<unknown, Error, User> = pipe(
      createUser(""),
      T.chain((user) => T.succeedWith(() => user))
    );

    await expect(T.runPromise(result)).rejects.toThrow(
      "User creation failed: enter name"
    );
  });
});