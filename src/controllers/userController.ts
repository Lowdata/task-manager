"use strict";

import { Request, Response } from "express";
import { createUser } from "../services/userService";
import * as T from "@effect-ts/core/Effect";
import { pipe } from "@effect-ts/core/Function";

export const createUserController = (req: Request, res: Response) => {
  const  name  = req.query.name as string;
  const tasks = req.body.tasks || [];

  if (typeof name !== "string" || name.trim() === "") {
    return res
      .status(400)
      .json({ message: "User creation failed: enter name" });
  }
  
  const effect = pipe(
    createUser(name, tasks),
    T.foldM(
      (error) =>
        T.succeedWith(() =>
          res.status(500).json({ message: (error as Error).message })
        ),
      (user) =>
        T.succeedWith(() => {
          if (!user) {
            return res
              .status(500)
              .json({ message: "User creation failed: undefined result" });
          }
          return res.status(201).json(user);
        })
    )
  );

  T.run(effect);
};