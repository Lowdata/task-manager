import { Request, Response } from "express";
import * as T from "@effect-ts/core/Effect";
import { pipe } from "@effect-ts/core/Function";
import { createTaskForUser, deleteTaskForUser, getTaskByIdForUser, getUserTasks, updateTaskForUser } from "../services/taskService";



export const createTaskForUserController = (req: Request, res: Response) => {
  const { user_id } = req.params;
  const task = req.body;

  const effect = pipe(
    createTaskForUser(user_id, task),
    T.foldM(
      (error) =>
        T.succeedWith(() =>
          res.status(500).json({ message: (error as Error).message })
        ),
      (task) => T.succeedWith(() => res.status(201).json(task))
    )
  );

  T.run(effect);
};


export const getUserTasksController = (req: Request, res: Response) => {
  const { user_id } = req.params;

  const effect = pipe(
    getUserTasks(user_id),
    T.foldM(
      (error) =>
        T.succeedWith(() =>
          res.status(500).json({ message: (error as Error).message })
        ),
      (tasks) => T.succeedWith(() => res.status(200).json(tasks))
    )
  );

  T.run(effect);
};

export const getTaskByIdForUserController = (req: Request, res: Response) => {
  const { user_id, task_id } = req.params;

  const effect = pipe(
    getTaskByIdForUser(user_id, task_id), // Call new service function
    T.foldM(
      (error) =>
        T.succeedWith(() =>
          res.status(404).json({ message: (error as Error).message })
        ),
      (task) => T.succeedWith(() => res.status(200).json(task))
    )
  );

  T.run(effect);
};


export const updateTaskForUserController = (req: Request, res: Response) => {
  const { user_id, task_id } = req.params;
  const updatedTaskData = req.body;

  const effect = pipe(
    updateTaskForUser(user_id, task_id, updatedTaskData),
    T.foldM(
      (error) =>
        T.succeedWith(() =>
          res.status(500).json({ message: (error as Error).message })
        ),
      (task) => T.succeedWith(() => res.status(200).json(task))
    )
  );

  T.run(effect);
};

export const deleteTaskForUserController = (req: Request, res: Response) => {
  const { user_id, task_id } = req.params;

  const effect = pipe(
    deleteTaskForUser(user_id, task_id),
    T.foldM(
      (error) =>
        T.succeedWith(() =>
          res.status(500).json({ message: (error as Error).message })
        ),
      () => T.succeedWith(() => res.status(204).send())
    )
  );

  T.run(effect);
};