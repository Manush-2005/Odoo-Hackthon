import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
   
    role: {
        type: String,
        enum: ['Employee', 'Manager', 'Admin'],
        default: 'Employee'
    },
   
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee', 
        required: false
    },

    isManagerApprover: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default EmployeeSchema;
