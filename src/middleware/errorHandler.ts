import shortUUID from "short-uuid";
import { Request, Response, NextFunction } from "express";

// user id validator
const isValidId = (user_id: string): boolean=>{
    const translator = shortUUID();
    return translator.validate(user_id);
}

export const validateUserId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.params;
  if (!isValidId(user_id)) {
    return res.status(400).json({ message: "User not found" });
  }
  next();
};

export const validateTaskId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { task_id } = req.params;
  if (!isValidId(task_id)) {
    return res.status(400).json({ message: "Invalid taskId format" });
  }
  next();
};