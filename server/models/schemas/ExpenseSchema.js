import mongoose from "mongoose";

const approvalStepSchema = new mongoose.Schema({
   
    approverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
   
    sequence: {
        type: Number,
        required: true
    },
    
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
 
    comments: {
        type: String,
        default: null
    },
    approvalDate: {
        type: Date,
        default: null
    }
});

const expenseSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    // Amount can be different from company's currency[cite: 18].
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true,
        uppercase: true
    },
    // Amount converted to company's default currency[cite: 44].
    amountInCompanyCurrency: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    dateOfExpense: { // Date the expense was incurred[cite: 19].
        type: Date,
        required: true
    },
    // OCR for receipts to autogenerate fields[cite: 46, 47].
    receiptData: {
        type: Object, // Stores data like 'date', 'restaurant name', 'expense lines'[cite: 47].
        required: false
    },
    currentStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
        },
        
    approvalWorkflow: [approvalStepSchema],
   
    conditionalRuleApplied: {
        type: String,
        required: false
    }
}, { timestamps: true });


export default expenseSchema;
