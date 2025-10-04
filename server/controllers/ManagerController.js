// controllers/ManagerController.js

import AdminModel from '../models/AdminModel.js';
import EmployeeModel from '../models/EmployeeModel.js';
import ExpenseModel from '../models/ExpenseModel.js';
// Import utilities for external APIs and processing
import { fetchCurrencyRates } from '../utils/currency.utils.js'; 


const Company = AdminModel;
const Employee = EmployeeModel;
const Expense = ExpenseModel;

const findEmployeeById = async (id) => {
    return await Employee.findById(id);
};

const findExpenseById = async (id) => {
    return await Expense.findById(id);
};

// --- Utility Functions ---

/**
 * Finds the currently pending approval step for a given manager on an expense.
 */
const findCurrentApprovalStep = (expense, managerId) => {
    return expense.approvalWorkflow.find(step =>
        step.approverId.toString() === managerId.toString() && step.status === 'Pending'
    );
};

/**
 * Checks if the current step is the final one in the workflow.
 */
const isFinalStep = (expense) => {
    // Finds the step with the highest sequence number that is still pending or was just completed.
    const maxSequence = Math.max(...expense.approvalWorkflow.map(step => step.sequence));
    const currentStep = expense.approvalWorkflow.find(step => step.sequence === maxSequence);
    
    // If the current step is the last one in the defined workflow, it's final.
    return currentStep && currentStep.sequence === maxSequence;
};


// --- Core Approval Workflow Controllers ---

/**
 * View expenses waiting for the current manager's approval step.
 * GET /api/managers/approvals/pending
 */
export const getExpensesPendingApproval = async (req, res, next) => {
    const managerId = req.params.employeeId;
    
    // Find expenses where the manager is the approver AND the step is pending.
    const pendingExpenses = await Expense.find({
        'approvalWorkflow.approverId': managerId,
        'approvalWorkflow.status': 'Pending' 
    }).populate('employeeId', 'name email')
      .sort({ dateSubmitted: 1 });

    // Filter to ensure the manager is only shown expenses where their step is the NEXT required one.
    const relevantPendingExpenses = pendingExpenses.filter(expense => {
        const lowestPendingSequence = Math.min(
            ...expense.approvalWorkflow
                .filter(step => step.status === 'Pending')
                .map(step => step.sequence)
        );
        
        const managerStep = expense.approvalWorkflow.find(step => 
            step.approverId.toString() === managerId.toString()
        );
        
        return managerStep && managerStep.sequence === lowestPendingSequence;
    });

    res.status(200).json({
        status: 'success',
        results: relevantPendingExpenses.length,
        data: { expenses: relevantPendingExpenses }
    });
};

/**
 * View expenses submitted by the manager's direct reports (View team expenses).
 * GET /api/managers/team-expenses
 */
export const getTeamExpenses = async (req, res, next) => {
    const managerId = req.user._id;
    
    // 1. Find all employees who report to this manager
    const teamMembers = await Employee.find({ managerId }).select('_id');
    const teamMemberIds = teamMembers.map(member => member._id);

    // 2. Find all expenses submitted by those team members
    const teamExpenses = await Expense.find({ 
        employeeId: { $in: teamMemberIds } 
    }).populate('employeeId', 'name email')
      .sort({ dateSubmitted: -1 });
    
    res.status(200).json({
        status: 'success',
        results: teamExpenses.length,
        data: { expenses: teamExpenses }
    });
};

/**
 * Approve the expense at the manager's current sequence step.
 * PUT /api/managers/expenses/:expenseId/approve
 */
export const approveExpense = async (req, res, next) => {
    const managerId = req.user._id;
    const { comments } = req.body;

    const expense = await Expense.findById(req.params.expenseId);

    if (!expense) {
        return res.status(404).json({ message: 'Expense not found.' });
    }

    // 1. Check if the manager is the approver for the currently pending step
    const currentStep = findCurrentApprovalStep(expense, managerId);
    
    if (!currentStep) {
        return res.status(403).json({ message: 'Access denied: Not your pending approval step.' });
    }
    
    // 2. Update the status of the current step
    currentStep.status = 'Approved';
    currentStep.comments = comments || 'Approved.';
    currentStep.approvalDate = Date.now();

    // 3. Determine if this approval is the final action
    let newStatus = 'Pending';
    
    // Find the next pending step (if any)
    const nextStep = expense.approvalWorkflow.find(step => 
        step.status === 'Pending' && step.sequence > currentStep.sequence
    );

    if (!nextStep) {
        // No further pending steps means the expense is fully approved
        newStatus = 'Approved';
    }

    expense.currentStatus = newStatus;

    // 4. Save the updated expense
    await expense.save();

    res.status(200).json({
        status: 'success',
        message: `Expense approved. Status: ${newStatus}`,
        data: { expense }
    });
};

/**
 * Reject the expense at the manager's current sequence step (with comments).
 * PUT /api/managers/expenses/:expenseId/reject
 */
export const rejectExpense = async (req, res, next) => {
    const managerId = req.user._id;
    const { comments } = req.body;
    
    if (!comments || comments.length < 5) {
        return res.status(400).json({ message: 'Rejection requires detailed comments.' });
    }

    const expense = await Expense.findById(req.params.expenseId);
    
    if (!expense) {
        return res.status(404).json({ message: 'Expense not found.' });
    }

    // 1. Check if the manager is the approver for the currently pending step
    const currentStep = findCurrentApprovalStep(expense, managerId);

    if (!currentStep) {
        return res.status(403).json({ message: 'Access denied: Not your pending approval step.' });
    }

    // 2. Reject the current step and set the overall status to Rejected
    currentStep.status = 'Rejected';
    currentStep.comments = comments;
    currentStep.approvalDate = Date.now();
    expense.currentStatus = 'Rejected';
    
    // Note: All subsequent pending steps in the workflow are effectively canceled.

    // 3. Save the updated expense
    await expense.save();

    res.status(200).json({
        status: 'success',
        message: 'Expense rejected.',
        data: { expense }
    });
};


// --- Utility Controller ---

/**
 * Fetch necessary currency conversion rates (to show amount in company's default currency)
 * GET /api/managers/currency-rates/:baseCurrency
 */
export const getConversionRates = async (req, res, next) => {
    const baseCurrency = req.params.baseCurrency.toUpperCase();
    const company = await Company.findById(req.user.companyId).select('defaultCurrency');
    
    if (!company) {
        return res.status(404).json({ message: 'Company profile not found.' });
    }

    // Use a utility function to fetch the rate between the base currency and the company's default currency.
    // Example utility function output: { rate: 0.85 }
    const rates = await fetchCurrencyRates(baseCurrency, company.defaultCurrency); 
    
    res.status(200).json({
        status: 'success',
        data: {
            base: baseCurrency,
            target: company.defaultCurrency,
            rate: rates.rate 
        }
    });
};