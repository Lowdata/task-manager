"use strict";

import { Router } from "express";
import { createUserController } from "../controllers/userController";
import {
  createTaskForUserController,
  deleteTaskForUserController,
  getTaskByIdForUserController,
  getUserTasksController,
  updateTaskForUserController,
} from "../controllers/taskController";
import { validateTaskId, validateUserId } from "../middleware/errorHandler";

const router = Router();

router.post("/", createUserController);
router.post("/:user_id/tasks", validateUserId, createTaskForUserController);


router.get("/:user_id/tasks", validateUserId, getUserTasksController);


router.get(
  "/:user_id/tasks/:task_id",
  validateTaskId,
  validateUserId,
  getTaskByIdForUserController
);


router.put(
  "/:user_id/tasks/:task_id",
  validateTaskId,
  validateUserId,
  updateTaskForUserController
);


router.delete(
  "/:user_id/tasks/:task_id",
  validateTaskId,
  validateUserId,
  deleteTaskForUserController
);
export default router;
