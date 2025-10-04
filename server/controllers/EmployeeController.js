// controllers/EmployeeController.js

import AdminModel from '../models/AdminModel.js';
import EmployeeModel from '../models/EmployeeModel.js';
import ExpenseModel from '../models/ExpenseModel.js';
// Import utilities for external APIs and processing
import { fetchCurrencyRates } from '../utils/currency.utils.js'; 


const Company = AdminModel;
const Employee = EmployeeModel;
const Expense = ExpenseModel;


/**
 * Utility to calculate the initial approval workflow based on the Employee's manager.
 */
const initializeApprovalWorkflow = async (employeeId, companyId) => {
    // 1. Fetch employee and company details
    const employee = await Employee.findById(employeeId);
    const company = await Company.findById(companyId);

    if (!employee || !company) {
        throw new Error('Employee or Company not found during workflow initialization.');
    }

    const workflow = [];

    // NOTE: The simplified logic here assumes a single manager approval step, 
    // based on the NOTE in the Problem Statement. Complex multi-level rules 
    // would be calculated here based on Company.approvalRules.

    // Check if the expense is first approved by their manager
    if (employee.isManagerApprover && employee.managerId) {
        workflow.push({
            approverId: employee.managerId,
            sequence: 1, // First step
            status: 'Pending',
        });
    } else if (employee.role === 'Admin') {
        // Admins don't need approval for their own expenses
        return {
            workflow: [],
            status: 'Approved'
        };
    } else {
        // Fallback or move to a default Finance/Admin approver if no manager is set
        workflow.push({
            approverId: company.adminUser,
            sequence: 1,
            status: 'Pending'
        });
    }

    return {
        workflow: workflow,
        status: workflow.length > 0 ? 'Pending' : 'Approved'
    };
};

// --- Core Expense Submission & Viewing Controllers ---

/**
 * Submit expense claims (Amount, Category, Description, Date)
 * POST /api/employees/expenses
 */
export const submitExpenseClaim = async (req, res, next) => {
    const { 
        amount, 
        currency, 
        category, 
        description, 
        dateOfExpense,
        receiptData
    } = req.body;
    
    const employeeId = req.body.employeeId;
    const companyId = req.body.companyId;

    // 1. Get company's default currency
    const company = await Company.findById(companyId).select('defaultCurrency');
    
    // 2. Convert amount to company's default currency
    const rates = await fetchCurrencyRates(currency, company.defaultCurrency);
    const amountInCompanyCurrency = amount * rates.rate;

    // 3. Initialize Approval Workflow
    const { workflow, status } = await initializeApprovalWorkflow(employeeId, companyId);
    
    // 4. Create the Expense
    const newExpense = await Expense.create({
        employeeId,
        companyId,
        amount,
        currency,
        amountInCompanyCurrency,
        category,
        description,
        dateOfExpense,
        receiptData: receiptData || null,
        currentStatus: status,
        approvalWorkflow: workflow
    });

    res.status(201).json({
        status: 'success',
        message: 'Expense submitted successfully.',
        data: { expense: newExpense }
    });
};

/**
 * View their own expense history and check approval status
 * GET /api/employees/expenses
 */
export const getOwnExpenseHistory = async (req, res) => {
    // Employee can view their expense history
    const expenses = await Expense.find({ employeeId: req.params.employeeId })
        .sort({ dateSubmitted: -1 })
        .select('dateOfExpense amount currency currentStatus category');

    res.status(200).json({
        status: 'success',
        results: expenses.length,
        data: { expenses }
    });
};

/**
 * View details of a specific expense claim
 * GET /api/employees/expenses/:expenseId
 */
export const getExpenseDetails = async (req, res, next) => {
    const expense = await Expense.findOne({ 
        _id: req.params.expenseId, 
    }).populate('approvalWorkflow.approverId', 'name role'); // Show approver name/role

    if (!expense) {
        return res.status(404).json({ message: 'Expense not found.' });
    }

    res.status(200).json({
        status: 'success',
        data: { expense }
    });
};

/**
 * Employee can update a pending expense (e.g., attach a better receipt)
 * PUT /api/employees/expenses/:expenseId
 */
export const updatePendingExpense = async (req, res, next) => {
    // Employee can only update expenses that are 'Pending'
    const updatedExpense = await Expense.findOneAndUpdate(
        { 
            _id: req.params.expenseId, 
            employeeId: req.user._id,
            currentStatus: 'Pending'
        },
        req.body, // Update the fields sent in the body
        { new: true, runValidators: true }
    );

    if (!updatedExpense) {
        return res.status(404).json({ message: 'Expense not found or is already Approved/Rejected.' });
    }

    res.status(200).json({
        status: 'success',
        message: 'Expense updated successfully.',
        data: { expense: updatedExpense }
    });
};

