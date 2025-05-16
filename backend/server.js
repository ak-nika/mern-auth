const app = require("./app");
const connectDB = require("./config/mongodb");

require("dotenv").config();

const port = process.env.PORT || 3000;

connectDB();
app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
