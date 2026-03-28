const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// ADD PROJECT (temporary, no auth for now)
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      images,
      demoVideoUrl,
      techStack,
      s3FileKey,
    } = req.body;

    if (!title || !description || !price || !s3FileKey) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const project = await Project.create({
      title,
      description,
      price,
      images,
      demoVideoUrl,
      techStack,
      s3FileKey,
    });

    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET ALL PROJECTS
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET SINGLE PROJECT
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
