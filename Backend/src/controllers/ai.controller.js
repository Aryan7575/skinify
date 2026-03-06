const imagekit = require("../utils/imagekit");
const Product = require("../modules/products.modules");
const { analyzeImage } = require("../utils/openaiService");

exports.analyzeAndRecommend = async (req, res) => {
  try {
    // Upload image to ImageKit
    const uploadedImage = await imagekit.upload({
      file: req.file.buffer,
      fileName: Date.now() + ".jpg",
      folder: "/ai-uploads"
    });

    const imageUrl = uploadedImage.url;

    // Send to OpenAI
    const aiResponse = await analyzeImage(imageUrl);

    const keywords = aiResponse.text
      .toLowerCase()
      .split(/,|\n/)
      .map(word => word.trim());

    const products = await Product.find({
      tags: { $in: keywords }
    });

    res.json({
      imageUrl,
      detectedIssues: keywords,
      recommendedProducts: products
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};