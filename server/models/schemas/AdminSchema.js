// This is the company schema and also the Admin schema.

import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
   
    name: {
        type: String,
        required: true,
        trim: true
    },
  
    defaultCurrency: {
        type: String,
        required: true,
        uppercase: true
    },
    countryCode: {
        type: String,
        required: true,
        uppercase: true
    },
    approvalRules: [{
        name: { type: String, required: true },
        
        type: {
            type: String,
            enum: ['Percentage', 'SpecificApprover', 'Hybrid'],
            required: true
        },
       
        value: { type: mongoose.Mixed, required: true },
        specificApproverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
            required: false // Only required for SpecificApprover or Hybrid rules
        }
    }],
    overrideApprovalEnabled: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default AdminSchema;
