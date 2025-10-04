import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import AdminRouter from './adminRoutes.js';
import EmployeeRouter from './EmployeeRoutes.js';
import ManagerRouter from './ManagerRoutes.js';
import AdminModel from "./models/AdminModel.js";
import EmployeeModel from './models/EmployeeModel.js';
    
    // Load environment variables
    dotenv.config();
    
    
    const app = express();
    
    // Middleware to parse JSON
    app.use(express.json());
    app.use(cors());

    
    
    // Demo Route
    app.get('/api/hello', (req, res) => {
      res.json({ message: 'Hello from the backend!' });
    });
    
    const PORT = process.env.PORT || 5000;


    app.use("/api/admin", AdminRouter);
    app.use("/api/Employee", EmployeeRouter);
    app.use("/api/Manager", ManagerRouter);



    app.get('/api/admin/info/:adminId', async (req, res) => {
  try {
    const admin = await AdminModel.findById(req.params.adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json({ data: admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/employee/info-by-email/:email', async (req, res) => {
  try {
    const admin = await EmployeeModel.findOne({ email: req.params.email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json({ data: admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
    
    app.listen(PORT, async() => {

       try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    process.exit(1);
  }
      console.log(`🚀 Server running on port ${PORT}`);
    });