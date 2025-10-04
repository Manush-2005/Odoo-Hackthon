import EmployeeSchema from "./schema/EmployeeSchema.js";
import mongoose from "mongoose";


const EmployeeModel = mongoose.model("Employee", EmployeeSchema);

export default EmployeeModel;