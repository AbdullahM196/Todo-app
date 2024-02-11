const categoryModel = require("../Models/categoryModel");
const asyncHandler = require("express-async-handler");

const addCategory = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) {
    res.status(400);
    throw new Error("category dose not saved");
  }
  const category = await categoryModel.create({
    title: title,
    userId: req.user._id,
  });
  res.status(201).json({ category });
});
const getCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await categoryModel
      .find({ userId: req.user._id })
      .populate("todos");
    res.status(200).json(categories);
  } catch (err) {
    throw new Error(err);
  }
});
const getCategoryById = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const category = await categoryModel
    .findOne({ _id: categoryId })
    .populate("todos");

  if (category.userId.toString() == req.user._id.toString()) {
    res.status(200).json(category);
  } else {
    res.status(404);
    throw new Error("category not found");
  }
});
const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { title } = req.body;
  const category = await categoryModel.findOne({ _id: categoryId });
  if (category.userId.toString() == req.user._id.toString()) {
    category.title = title;
    await category.save();
    res.status(200).json(category);
  } else {
    res.status(404);
    throw new Error("category not found");
  }
});
const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const category = await categoryModel.findOne({ _id: categoryId }).exec();

  if (category.userId.toString() == req.user._id.toString()) {
    await categoryModel.findByIdAndDelete(categoryId);
    res.status(200).json(category);
  } else {
    res.status(404);
    throw new Error("category not found");
  }
});
module.exports = {
  addCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
