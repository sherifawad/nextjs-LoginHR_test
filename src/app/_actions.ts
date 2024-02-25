"use server";

import { generateLabelValueEmployeesList } from "@/lib/utils/filterUtils";
import { FilterOption } from "@/types";
import { Employee } from "@/validation/employeeSchema";
import { GetAllEmployees } from "./profile/_actions";

export const getSelectedOptions = async (
	property: keyof Employee,
): Promise<FilterOption[]> => {
	const employees = await GetAllEmployees();
	return generateLabelValueEmployeesList(employees, property);
};
