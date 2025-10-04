import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  
  description: { type: String, required: true },
  category: { type: String },
  date: { type: Date, default: Date.now },
  paidBy: { type: String, enum: ["Self", "Company"], default: "Self" },

  
  amount: { type: Number, required: true },
  currency: { type: String, default: "USD" },
  convertedAmount: { type: Number }, 

  
  receiptUrl: { type: String },

  
  approvalStatus: { type: String, enum: ["Draft", "Pending", "Approved", "Rejected"], default: "Draft" },
  approverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approvalNotes: { type: String },
  approvalTime: { type: Date },

  remarks: String,
  createdAt: { type: Date, default: Date.now }
});

export default expenseSchema;
