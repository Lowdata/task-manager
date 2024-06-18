import shortUUID from "short-uuid";
import { Request, Response, NextFunction } from "express";

// user id validator
const isValidId = (userId: string): boolean=>{
    const translator = shortUUID();
    return translator.validate(userId);
}

export const validateUserId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;
  if (!isValidId(userId)) {
    return res.status(400).json({ message: "Invalid userId format" });
  }
  next();
};

export const validateTaskId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { taskId } = req.params;
  if (!isValidId(taskId)) {
    return res.status(400).json({ message: "Invalid taskId format" });
  }
  next();
};