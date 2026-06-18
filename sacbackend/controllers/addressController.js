const Address = require("../models/Address");

exports.saveAddress = async (req, res) => {
  try {
    const address = await Address.create({
      user: req.user.id,
      ...req.body,
    });

    res.json(address);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserAddress = async (req, res) => {
  try {
    const addresses = await Address.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(addresses);   // array return kara
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};