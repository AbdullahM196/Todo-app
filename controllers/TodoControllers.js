const express = require("express");
const todoModel = require("../Models/todosModel");
const asyncHandler = require("express-async-handler");
const categoryModel = require("../Models/categoryModel");
const fs = require("fs");
const path = require("path");

const addTodo = asyncHandler(async (req, res) => {
  console.log("req.user from add todo", req.user);
  const { title, body, status, categoryId } = req.body;
  const img = req.file;

  if (!title && !body) {
    res.status(400);
    throw new Error("todo dose not saved");
  }
  try {
    const todoData = {};
    console.log(img);
    if (img) {
      todoData.img = img.filename;
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
    console.log("*".repeat(15), todoData, "*".repeat(15));
    const todo = await todoModel.create({
      title: title,
      body: body,
      status: status,
      userId: req.user._id,
      ...todoData,
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
  console.log({ body: req.body });
  console.log({ file: req.file });

  try {
    const todo = await todoModel.findById(todoId).exec();
    // check owner of the task
    if (todo.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error("Unauthorized access to todo"));
    }
    if (!todo) {
      res.status(404);
      return next(new Error("Todo not found"));
    }

    if (todo.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error("Unauthorized access to todo"));
    }

    todo.title = title || todo.title;
    todo.body = body || todo.body;
    todo.status = status || todo.status;

    if (categoryId) {
      console.log({ categoryId });
      console.log({ [todo.categoryId.toString()]: todo.categoryId.toString() });
      if (categoryId === todo.categoryId.toString()) {
        // Category ID is the same, no need to change anything.
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
          console.log({ oldCategory });

          if (oldCategory) {
            const todoIndex = oldCategory.todos.indexOf(todo._id);

            if (todoIndex !== -1) {
              oldCategory.todos.splice(todoIndex, 1);
              await oldCategory.save();
            }
          }
        }

        // Add to new category.
        newCategory.todos.push(todoId);
        await newCategory.save();
        todo.categoryId = categoryId;
      }
    }
    if (img) {
      console.log(img);
      if (
        todo.img &&
        fs.existsSync(path.join(__dirname, "../Images", todo.img))
      ) {
        fs.unlinkSync(path.join(__dirname, "../Images", todo.img));
      }
      todo.img = img.filename;
    } else {
      todo.img = todo.img;
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
  if (todo.userId.toString() == req.user._id.toString()) {
    try {
      const deletedTodo = await todoModel.findByIdAndDelete(todoId);
      const category = await categoryModel.findOne({ _id: todo.categoryId });
      if (category) {
        let todoIndex = category.todos.findIndex((id) => todo._id == id);
        category.todos.splice(todoIndex, 1);
        await category.save();
      }
      if (todo.img) {
        if (fs.existsSync(path.join(__dirname, "../Images", todo.img))) {
          fs.unlinkSync(path.join(__dirname, "../Images", todo.img));
          console.log("image deleted");
        }
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
