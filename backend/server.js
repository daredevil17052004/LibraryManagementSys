const express = require("express");
const dotenv = require("dotenv");
const mysql = require("mysql2");
const cors = require("cors");
const bookRoutes = require('./routes/bookRoutes');
const memberRoutes = require('./routes/memberRoutes');
const issuanceRoutes = require('./routes/issuanceRoutes'); 
const authenticateAPIKey = require("./middleware/authMiddleware");
const bodyParser = require("body-parser")

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors()); 
app.use(bodyParser.json());

app.use("/api/books",authenticateAPIKey ,bookRoutes);
app.use("/api/members",authenticateAPIKey , memberRoutes);
app.use("/api/issuance",authenticateAPIKey , issuanceRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});  
