const express = require("express");
const app = express();
const PORT = 3000;

// Middleware đơn giản
app.use(express.json());

// Route test
app.get("/", (req, res) => {
  res.send("Hello Express!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
