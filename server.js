require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const connectDb = require("./config/dbConfig");
const cors = require("cors");
const corsOptions = require("./middleware/corsOptions");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const clientRoutes = require("./routes/clientRoutes");
const adminRoutes = require("./routes/adminRoutes");
const createAdminUser = require("./services/adminService"); 
const swaggerUi = require("swagger-ui-express");
const specs = require("./config/swaggerConfig");
const PORT = process.env.PORT || 8080;

connectDb();

app.use(credentials);
app.use(cors(corsOptions));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(express.json());
app.use(cookieParser());

app.use("/api/client", clientRoutes);
app.use("/api/admin", adminRoutes);

mongoose.connection.once("open", async () => {
  console.log("Connected to MongoDB");
  await createAdminUser();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
