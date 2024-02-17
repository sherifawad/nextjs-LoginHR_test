"use server";

import { getFilteredResult } from "@/components/filters/constants";
import { Employee, EmployeeFilter } from "@/validation/employeeSchema";
import { GetAllEmployees } from "../profile/_actions";

export type CreatedFilter = {
	filteredEmployees: Employee[];
};

export const getFilteredEmployees = async ({
	filters,
}: {
	filters: EmployeeFilter[];
}): Promise<CreatedFilter> => {
	let employees = await GetAllEmployees();
	console.log("🚀 ~ employees:", employees);
	try {
		// validate input filter
		const validFilters: EmployeeFilter[] = [];
		filters.forEach(f => {
			const valid = EmployeeFilter.safeParse(f);
			if (valid.success) {
				validFilters.push(valid.data);
			}
		});
		if (validFilters.length < 1) {
			return { filteredEmployees: employees };
		}

		const filteredEmployees = getFilteredResult({
			employees,
			filters,
		});

		return { filteredEmployees };
	} catch (error) {
		console.log("🚀 ~ error:", error);
		return { filteredEmployees: employees };
	}
};

export const deleteExistingFilter = async ({}) => {};
