const { z } = require("zod");

const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),

  status: z
    .enum(["Pending", "Completed"])
    .optional(),

  priority: z
    .enum(["Low", "Medium", "High"])
    .optional(),

  dueDate: z.coerce.date().optional()
});

const updateTaskSchema = createTaskSchema.partial();

module.exports = {
  createTaskSchema,
  updateTaskSchema,
};