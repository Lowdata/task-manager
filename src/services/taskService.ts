
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

export const updateTaskForUser = (
  userId: string,
  taskId: string,
  updatedTaskData: Partial<Task>
): T.UIO<Task> =>
  T.succeedWith(() => {
    const user = db.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const taskIndex = user.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    const updatedTask = { ...user.tasks[taskIndex], ...updatedTaskData };
    user.tasks[taskIndex] = updatedTask;

    return updatedTask;
  });

export const deleteTaskForUser = (
  userId: string,
  taskId: string
): T.UIO<void> =>
  T.succeedWith(() => {
    const user = db.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const taskIndex = user.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    user.tasks.splice(taskIndex, 1);
});