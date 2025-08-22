const express = require("express");
const { taskController } = require("../controllers/taskController");

const router = express.Router();

// Task CRUD routes
router.post("/tasks", taskController.createTask);
router.get("/tasks", taskController.getTasks);
router.get("/tasks/:id", taskController.getTaskById);
router.put("/tasks/:id", taskController.updateTask);
router.delete("/tasks/:id", taskController.deleteTask);
router.get("/tasks/stats/:userId", taskController.getTaskStats);

module.exports = router;