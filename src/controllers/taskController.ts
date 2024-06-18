import { Request, Response } from "express";
import * as T from "@effect-ts/core/Effect";
import { pipe } from "@effect-ts/core/Function";
import { createTaskForUser } from "../services/taskService";
import { db } from "../database/inMemoryDb";
import { Task } from "../model/task";


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


