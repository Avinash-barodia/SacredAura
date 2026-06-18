const SiteSettings = require("../models/SiteSettings");
const cloudinary = require("../config/cloudinary");

const initSettings = async () => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({
      showcaseItems: [
        { id: "locks", product: null },
        { id: "taps", product: null },
        { id: "soap", product: null },
        { id: "dryers", product: null },
        { id: "lights", product: null },
        { id: "flush", product: null },
        { id: "dustbins", product: null },
        { id: "switches", product: null }
      ]
    });
  }
  return settings;
};

exports.getSettings = async (req, res) => {
  try {
    const settings = await initSettings();
    await settings.populate("showcaseItems.product");
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await initSettings();

    if (req.files?.heroVideo) {
      const upload = await cloudinary.uploader.upload(req.files.heroVideo[0].path, { 
        resource_type: "video", 
        folder: "hero" 
      });
      settings.heroVideo = upload.secure_url;
    }

    if (req.files?.promoVideo1) {
      const upload = await cloudinary.uploader.upload(req.files.promoVideo1[0].path, { 
        resource_type: "video", 
        folder: "promo" 
      });
      settings.promoVideo1 = upload.secure_url;
    }

    if (req.files?.promoVideo2) {
      const upload = await cloudinary.uploader.upload(req.files.promoVideo2[0].path, { 
        resource_type: "video", 
        folder: "promo" 
      });
      settings.promoVideo2 = upload.secure_url;
    }

    if (req.body.showcaseItems) {
      const items = JSON.parse(req.body.showcaseItems);
      items.forEach(item => {
        const index = settings.showcaseItems.findIndex(s => s.id === item.id);
        if (index !== -1) {
          settings.showcaseItems[index].product = item.productId || null;
        }
      });
    }

    await settings.save();
    await settings.populate("showcaseItems.product");
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
