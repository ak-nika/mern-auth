const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./config/mongodb");

dotenv.config();

const port = process.env.PORT || 5000;

connectDB();
app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
