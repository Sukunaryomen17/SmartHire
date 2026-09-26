require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`SmartHire backend running on port ${PORT}`);

  if (process.env.FASTAPI_URL) {
    console.log(`FastAPI URL: ${process.env.FASTAPI_URL}`);
  }
});