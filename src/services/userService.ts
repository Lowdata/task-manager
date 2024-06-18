"use strict";

import * as T from "@effect-ts/core/Effect";
import { db } from '../database/inMemoryDb'
import shortUUID from "short-uuid";
import { User } from "../model/user";
import { Task } from "../model/task";

export const createUser = (name: string, tasks: Task[] = []) =>
  T.succeedWith(() => {
    if (!name) {
      throw new Error("User creation failed: enter name");
    }
    const user: User = { id: shortUUID.generate(), name, tasks };
    db.addUser(user);
    return user;
  });