const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { generateBuildingFromBlueprint, generateDisasterParams } = require("./mockGenerator");

const app = express();
app.use(require("cors")());
app.use(express.json());

// Mock mode - set to true when Blender is not available
const MOCK_MODE = true;

const upload = multer({ dest: "uploads/" });

// Upload blueprint and generate building
app.post("/upload", upload.single("blueprint"), (req, res) => {
  const blueprintPath = req.file.path;

  if (MOCK_MODE) {
    // Generate building without Blender
    console.log("Mock mode: Generating building from blueprint...");
    const buildingData = generateBuildingFromBlueprint(blueprintPath);

    // Save building data as JSON
    const outputPath = path.join(__dirname, "blender", "output", "building.json");
    fs.writeFileSync(outputPath, JSON.stringify(buildingData, null, 2));

    return res.json({
      status: "success",
      message: "Building generated (mock mode)",
      building: buildingData
    });
  }

  // Real Blender mode
  const blenderCmd = `blender --background --python blender/convert.py -- ${blueprintPath}`;

  exec(blenderCmd, (err) => {
    if (err) {
      console.error("Blender error:", err);
      return res.status(500).json({
        status: "error",
        message: "Blender processing failed"
      });
    }
    res.json({
      status: "success",
      message: "3D model created"
    });
  });
});

// Generate building endpoint
app.post("/api/generate-building", express.json(), (req, res) => {
  const { width, height, depth, floors, type } = req.body;

  const buildingData = {
    type: type || 'custom',
    floors: floors || 3,
    dimensions: {
      width: width || 10,
      height: height || 12,
      depth: depth || 10
    },
    materials: {
      walls: 'concrete',
      roof: 'tiles',
      windows: 'standard'
    },
    generated: true,
    timestamp: new Date().toISOString()
  };

  res.json({
    status: "success",
    building: buildingData
  });
});

// Get disaster simulation parameters
app.post("/api/simulate", express.json(), (req, res) => {
  const { disasterType, intensity } = req.body;

  if (!disasterType) {
    return res.status(400).json({
      status: "error",
      message: "Disaster type is required"
    });
  }

  const params = generateDisasterParams(disasterType, intensity || 5);

  res.json({
    status: "success",
    disaster: disasterType,
    intensity: intensity || 5,
    parameters: params
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    mode: MOCK_MODE ? "mock" : "blender",
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📦 Mode: ${MOCK_MODE ? 'MOCK (Blender not required)' : 'BLENDER'}`);
});

