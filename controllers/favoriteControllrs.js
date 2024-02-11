const asyncHandler = require("express-async-handler");
const favoriteModel = require("../Models/favoritesModel");

const addFavorites = asyncHandler(async (req, res) => {
  const { todoId } = req.body;
  console.log("req.body", req.body);
  console.log("todoId", todoId);
  try {
    let userFavorites = await favoriteModel
      .findOne({ userId: req.user._id })
      .exec();
    if (userFavorites) {
      userFavorites.todoes.push(todoId);
      await userFavorites.save();
    } else {
      const newFavorites = await favoriteModel.create({
        userId: req.user._id,
        todoes: [todoId],
      });
      userFavorites = newFavorites;
    }
    res.status(201).json(todoId);
  } catch (err) {
    throw new Error(err);
  }
});
const getFavorites = asyncHandler(async (req, res) => {
  try {
    const userFavorites = await favoriteModel.findOne({ userId: req.user._id });
    res.status(201).json(userFavorites);
  } catch (err) {
    throw new Error(err);
  }
});
const deleteFavorite = asyncHandler(async (req, res) => {
  const { todoId } = req.params;
  const Fav = await favoriteModel.findOne({ todoes: todoId }).exec();
  if (!Fav) {
    res.status(404);
    throw new Error("todo not found");
  }
  if (Fav.userId.toString() == req.user._id.toString()) {
    console.log(Fav);
    let deletedFavIndex = Fav.todoes.findIndex((item) => item == todoId);
    Fav.todoes.splice(deletedFavIndex, 1);
    await Fav.save();
    return res.status(200).json(todoId);
  } else {
    res.status(401);
    throw new Error("Not authorized");
  }
});
module.exports = {
  addFavorites,
  getFavorites,
  deleteFavorite,
};
