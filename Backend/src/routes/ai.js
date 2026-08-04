const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

const Product = require("../modules/products.modules");
const AiAnalysis = require("../modules/aianalysis.modules");
const { protect } = require("../middlewares/auth.middlewares");

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const CF_API_TOKEN = process.env.CF_API_TOKEN;

const CF_API_URL = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.2-11b-vision-instruct`;

const ALLOWED_CONCERNS = [
  "acne",
  "pigmentation",
  "darkspots",
  "oily",
  "dry",
  "tanning",
  "hairfall",
  "dandruff",
  "weightloss",
  "normal",
];

router.post("/analyze", protect, async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
      return res.status(500).json({
        message: "Cloudflare AI is not configured",
      });
    }

    // Ensure image is a Data URI
    const imageData = image.startsWith("data:image")
      ? image
      : `data:image/jpeg;base64,${image}`;

    // Strip the data URI prefix and convert base64 -> raw byte array
    const base64Only = imageData.includes(",")
      ? imageData.split(",")[1]
      : imageData;
    const imageBytes = Array.from(Buffer.from(base64Only, "base64"));

    console.log("📨 Sending request to Cloudflare AI...");

    const payload = {
      image: imageBytes,
      prompt: `You are a skincare AI.

Analyze the uploaded image.

Choose ONLY ONE concern from this list:

acne
pigmentation
darkspots
oily
dry
tanning
hairfall
dandruff
weightloss
normal

Reply ONLY with JSON.

Example:
{"concern":"acne"}`,
      max_tokens: 50,
    };

    console.log(JSON.stringify(payload, null, 2));

    const response = await fetch(CF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const raw = await response.text();

    console.log("Cloudflare Response:");
    console.log(raw);

    if (!response.ok) {
      return res.status(response.status).json({
        message: "Cloudflare AI request failed",
        error: raw,
      });
    }

    const cf = JSON.parse(raw);

    const output = cf.result.response;

    let concern = "normal";

    try {
      // output can come back as an object ({"concern":"hairfall"}),
      // as a JSON string, or as free text with the concern embedded in it.
      let parsed;

      if (output && typeof output === "object") {
        parsed = output;
      } else if (typeof output === "string") {
        const cleaned = output.replace(/```json|```/g, "").trim();
        parsed = JSON.parse(cleaned);
      }

      if (parsed && parsed.concern) {
        concern = String(parsed.concern).toLowerCase();
      }
    } catch {
      const outputText =
        typeof output === "string" ? output : JSON.stringify(output || "");
      const found = ALLOWED_CONCERNS.find((c) =>
        outputText.toLowerCase().includes(c)
      );

      if (found) concern = found;
    }

    if (!ALLOWED_CONCERNS.includes(concern)) {
      concern = "normal";
    }

    const products = await Product.find({
      tags: concern,
    });

    await AiAnalysis.create({
      userId: req.user.id,
      detectedIssue: concern,
      recommendedProducts: products.map((p) => p._id),
    });

    res.json({
      concern,
      products,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "AI failed",
      error: err.message,
    });
  }
});

module.exports = router;