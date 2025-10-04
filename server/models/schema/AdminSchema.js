// This is the company schema and also the Admin schema.

import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  baseCurrency: { type: String, default: "USD" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approvalRules: [
    {
      ruleName: String, 
      approvers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      minApprovalPercentage: { type: Number, default: 50 },
      isManagerApprovalRequired: { type: Boolean, default: true }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default AdminSchema;
