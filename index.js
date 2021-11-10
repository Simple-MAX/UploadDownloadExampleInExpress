const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/", upload.single("file"), (req, res) => {
  res.send("File uploaded");
});

app.get("/:name", (req, res) => {
  const stream = fs.createReadStream(`./uploads/${req.params.name}`);
  if (stream) {
    res.set("Content-Type", "application/octet-stream");
    res.set("Content-Disposition", `attachment; filename=${req.params.name}`);
    stream.pipe(res);
  } else {
    res.status(404).send("File not found");
  }
  stream.on("error", function (err) {
    res.end(err);
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
