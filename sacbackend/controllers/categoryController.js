const Category = require("../models/Category");
const apicache = require("apicache");

// Create Category or Subcategory
const createCategory = async (req, res) => {
  try {
    const { name, parent } = req.body;

    const category = new Category({
      name,
      parent: parent || null
    });

    await category.save();
    apicache.clear();
    res.json(category);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE CATEGORY
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const hasSubCategories = await Category.findOne({ parent: id });

    if (hasSubCategories) {
      return res.status(400).json({
        message: "Cannot delete category with subcategories",
      });
    }

    await Category.findByIdAndDelete(id);

    apicache.clear();
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
  deleteCategory,
};


