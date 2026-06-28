const express = require("express");
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus} = require('../controllers/task.controllers');
const protect = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/",protect,getTasks);
router.get("/:id",protect,getTask);
router.post("/",protect,createTask);
router.put("/:id",protect,updateTask);
router.delete("/:id",protect,deleteTask);
router.patch("/:id/toggle",protect,toggleTaskStatus);

module.exports = router;