"use strict";

import { Router } from "express";
import { createUserController } from "../controllers/userController";
import { createTaskForUserController } from "../controllers/taskController";
import { validateUserId } from "../middleware/errorHandler";

const router = Router();

router.post("/", createUserController);
router.post("/:user_id/tasks", validateUserId, createTaskForUserController);
export default router;
