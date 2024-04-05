const { User } = require("../models");
const ReadingList = require("../models/readinglists");
const { tokenExtractor } = require("../utils/middleware");

const router = require("express").Router();

// ROUTES

// api/readinglists
// POST
// Add to readinglist
router.post("/", async (req, res, next) => {
  try {
    const toRead = await ReadingList.create(req.body);
    res.json(toRead);
  } catch (error) {
    next(error);
  }
});

// api/readinglists/:id
// PUT
// Change read status
router.get("/:id", async (req, res) => {
  const reading = await ReadingList.findByPk(req.params.id);

  console.log("reading", reading);

  if (!reading) {
    return res.status(404).json({ error: "reading not found" });
  }

  return res.status(200).json(reading);
});

// api/readinglists/:id
// PUT
// Change read status
router.put("/:id", tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const reading = await ReadingList.findByPk(req.params.id);

    if (!user || !reading) {
      return res.status(404).json({ error: "user/reading not found." });
    }

    if (user.id !== reading.user_id) {
      return res.status(401).json({ error: "That blog isnt in your list" });
    }

    reading.read = req.body.read;
    await reading.save();

    res.json(reading);
    return res.json;
  } catch (error) {
    next(error);
  }
});

module.exports = router;
