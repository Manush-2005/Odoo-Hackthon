import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin", "Manager", "Employee"], default: "Employee" },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },

  
  teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

 
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  createdAt: { type: Date, default: Date.now }
});

export default EmployeeSchema;
