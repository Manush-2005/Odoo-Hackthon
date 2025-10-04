import expenseSchema from "./schemas/ExpenseSchema.js";
import mongoose from "mongoose";

const ExpenseModel = mongoose.model("Expense", expenseSchema);

export default ExpenseModel;
