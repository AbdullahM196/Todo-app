const todoModel = require("../Models/todosModel");
const asyncHandler = require("express-async-handler");
const categoryModel = require("../Models/categoryModel");
const saveImage = require("../config/saveToCloudinary");
const cloudinary = require("cloudinary").v2;
const addTodo = asyncHandler(async (req, res) => {
  const { title, body, status, categoryId } = req.body;
  const img = req.file;
  if (!title && !body) {
    res.status(400);
    throw new Error("todo dose not saved");
  }
  try {
    const todoData = {};

    if (img) {
      try {
        todoData.img = await saveImage(img);
      } catch (error) {
        res.status(500).json({ message: "Internal server error" });
        return;
      }
    }
    if (categoryId) {
      const category = await categoryModel.findOne({
        _id: categoryId,
      });
      if (category) {
        todoData.categoryId = category._id;
        category.todos.push(categoryId);
      } else {
        res.status(404);
        throw new Error("category not found");
      }
    }
    const todo = await todoModel.create({
      title: title,
      body: body,
      status: status,
      userId: req.user._id,
      categoryId: todoData.categoryId || null,
      img: todoData.img || null,
    });
    res.status(201).json({
      todo,
    });
  } catch (err) {
    throw new Error(err);
  }
});

const getTodoes = asyncHandler(async (req, res) => {
  try {
    const todo = await todoModel
      .find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.status(200).json(todo);
  } catch (err) {
    throw new Error(err);
  }
});
const getTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.params;
  const todo = await todoModel.findOne({ _id: todoId }).exec();
  if (todo.userId.toString() == req.user._id.toString()) {
    try {
      res.status(200).json(todo);
    } catch (err) {
      throw new Error(err);
    }
  } else {
    res.status(404);
    throw new Error("todo not found");
  }
});
const updateTodo = asyncHandler(async (req, res, next) => {
  const { todoId } = req.params;
  const { title, body, status, categoryId } = req.body;
  const img = req.file;
  try {
    const todo = await todoModel.findById(todoId).exec();
    if (!todo) {
      res.status(404);
      return next(new Error("Todo not found"));
    }
    // check owner of the task
    if (todo.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error("Unauthorized access to todo"));
    }

    todo.title = title || todo.title;
    todo.body = body || todo.body;
    todo.status = status || todo.status;

    if (categoryId) {
      if (categoryId === todo.categoryId.toString()) {
        todo.categoryId = categoryId;
      } else {
        const newCategory = await categoryModel.findById(categoryId).exec();

        if (!newCategory) {
          res.status(404);
          return next(new Error("New category not found"));
        }

        if (todo.categoryId) {
          // Delete from old category.
          const oldCategory = await categoryModel
            .findById(todo.categoryId)
            .exec();

          if (oldCategory) {
            const todoIndex = oldCategory.todos.indexOf(todo._id);

            if (todoIndex !== -1) {
              oldCategory.todos.splice(todoIndex, 1);
              await oldCategory.save();
            }
          }
        }
        newCategory.todos.push(todoId);
        await newCategory.save();
        todo.categoryId = categoryId;
      }
    }
    if (img) {
      if (todo?.img?.public_id) {
        await cloudinary.uploader.destroy(todo.img.public_id);
      }
      try {
        todo.img = await saveImage(img);
      } catch (error) {
        res.status(500).json({ message: "Internal server error" });
        return;
      }
    }

    const updatedTodo = await todo.save();
    res.status(200).json({
      updatedTodo,
    });
  } catch (err) {
    next(err);
  }
});

const deleteTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.params;
  const todo = await todoModel.findOne({ _id: todoId }).exec();
  if (!todo) {
    res.status(404);
    throw new Error("todo not found");
  }
  if (todo.img.public_id) {
    await cloudinary.uploader.destroy(todo.img.public_id);
  }
  if (todo.userId.toString() == req.user._id.toString()) {
    try {
      const deletedTodo = await todoModel.findByIdAndDelete(todoId);
      const category = await categoryModel.findOne({ _id: todo.categoryId });
      if (category) {
        let todoIndex = category.todos.findIndex((id) => todo._id == id);
        category.todos.splice(todoIndex, 1);
        await category.save();
      }
      res.status(200).json({
        deletedTodo,
      });
    } catch (err) {
      throw new Error(err);
    }
  } else {
    res.status(404);
    throw new Error("todo not found");
  }
});
module.exports = {
  addTodo,
  getTodoes,
  getTodo,
  updateTodo,
  deleteTodo,
};
