const express = require("express");
require('dotenv').config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/config/db");
const path =require("path");
const app = express();

const authRoutes = require("./src/routes/auth");
const symptomRoutes=require("./src/routes/symptoms");
const doctorRoutes=require("./src/routes/doctors");
const appointmentRoutes=require("./src/routes/appointments");
const aiRoutes = require("./src/routes/ai");
const eduRoutes=require("./src/routes/eduRoutes");
const adminRoutes= require("./src/routes/admin");
app.use(cors({
  origin: process.env.BASE_URL, // your frontend origin
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());





app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/symptoms", symptomRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/education",eduRoutes);
app.use("/api/admin",adminRoutes);


const PORT = process.env.PORT || 5000;
const _dirname = path.resolve();
if(process.env.NODE_ENV ==="production"){
  app.use(express.static(path.join(_dirname, "../frontend/dist")));
  app.get("/*splat", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });



}



app.listen(PORT, () => {
  console.log(`server running at port ${PORT}`);
  connectDB();
});
