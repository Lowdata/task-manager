
import * as T from '@effect-ts/core/Effect';
import { db } from '../database/inMemoryDb';
import shortUUID from 'short-uuid';
import { Task } from '../model/task';

export const createTaskForUser = (
  userId: string,
  taskData: Omit<Task, "id">
): T.UIO<Task> =>
  T.succeedWith(() => {
    const user = db.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const task: Task = {
      id: shortUUID.generate(),
      ...taskData,
    };
    user.tasks.push(task);
    return task;
});


export const getUserTasks = (userId: string): T.UIO<Task[]> =>
  T.succeedWith(() => {
    const user = db.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user.tasks;
});

export const getTaskByIdForUser = (
  userId: string,
  taskId: string
): T.UIO<Task> =>
  T.succeedWith(() => {
    const user = db.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const task = user.tasks.find((t) => t.id === taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    return task;
});