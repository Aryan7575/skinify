const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

const Product = require("../modules/products.modules");
const AiAnalysis = require("../modules/aianalysis.modules");
const { protect } = require("../middlewares/auth.middlewares");

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const CF_API_TOKEN  = process.env.CF_API_TOKEN;

const CF_API_URL = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.2-11b-vision-instruct`;

router.post("/analyze", protect, async (req, res) => {
  try {

    const { image } = req.body;

    console.log("Image received for AI");

    if (!image) {
      return res.status(400).json({ message: "Image required" });
    }

    const base64Data = image.includes(",") ? image.split(",")[1] : image;

    const response = await fetch(CF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Data}`,
                },
              },
              {
                type: "text",
                text: `You are a skin, hair and body analysis AI for a beauty and personal care ecommerce app.
Analyze this image carefully and detect the most visible concern.

Choose ONLY ONE from this list:
- acne: visible pimples, red bumps, breakouts on face
- pigmentation: uneven skin tone, dark patches on face
- darkspots: small dark spots or blemishes on skin
- oily: shiny, greasy looking facial skin
- dry: flaky, rough, dull skin on face
- tanning: sun darkened or tanned skin
- hairfall: visible thinning of hair, bald patches, sparse hair on scalp
- dandruff: white or yellow flakes visible on scalp or hair, flaky scalp
- weightloss: overweight or obese body, excess body fat visible
- normal: clear, even, healthy skin or hair with no visible concern

Reply with ONLY raw JSON, no explanation, no markdown:
{"concern":"pigmentation"}`,
              },
            ],
          },
        ],
        max_tokens: 50,
      }),
    });

    const rawText = await response.text();
    console.log("CF STATUS:", response.status);
    console.log("CF RAW:", rawText);

    if (!response.ok) {
      console.error("CF API ERROR:", rawText);
      return res.status(500).json({ message: "Cloudflare AI failed", error: rawText });
    }

    const cfData = JSON.parse(rawText);
    const aiResult = cfData?.result?.response;
    console.log("AI Result:", aiResult);

    let concern = "normal";

    try {
      if (typeof aiResult === "object" && aiResult?.concern) {
        concern = aiResult.concern;
      } else if (typeof aiResult === "string") {
        const cleaned = aiResult.replace(/```json|```/g, "").trim();
        try {
          const parsed = JSON.parse(cleaned);
          if (parsed.concern) concern = parsed.concern;
        } catch {
          const concerns = ["acne", "pigmentation", "darkspots", "oily", "dry", "tanning", "hairfall", "dandruff", "weightloss"];
          const found = concerns.find(c => cleaned.toLowerCase().includes(c));
          if (found) concern = found;
        }
      }
    } catch (err) {
      console.log("Parsing failed, defaulting to normal:", err.message);
    }

    console.log("Detected Concern:", concern);

    const products = await Product.find({
      tags: { $in: [concern] },
    });

    console.log("Products found:", products.length);

    await AiAnalysis.create({
      userId: req.user.id,
      detectedIssue: concern,
      recommendedProducts: products.map((p) => p._id),
    });

    res.json({ concern, products });

  } catch (error) {
    console.error("AI SERVER ERROR:", error);
    res.status(500).json({ message: "AI failed", error: error.message });
  }
});

module.exports = router;