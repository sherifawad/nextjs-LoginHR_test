"use server";

import { getFilteredResult } from "@/components/filters/constants";
import { deleteMany } from "@/database/employees-apiRepo";
import {
	dataToStringWithCustomSeparator,
	getReadableFilterValues,
	stringValuesToFilter,
} from "@/lib/utils/filterUtils";
import { FilterOption } from "@/types";
import { Employee, EmployeeFilter } from "@/validation/employeeSchema";
import { revalidatePath } from "next/cache";
import { GetAllEmployees } from "../profile/_actions";

export type CreatedFilter =
	| {
			status: "success";
			createdFilterValueString: string;
			updatedFilterList: FilterOption[];
			employees: Employee[];
	  }
	| {
			status: "error";
			message: string;
	  };

export const addNewFilter = async ({
	filters,
	newFilter,
}: {
	filters: FilterOption[];
	newFilter: EmployeeFilter;
}): Promise<CreatedFilter> => {
	try {
		const employees = await GetAllEmployees();
		// validate input filter
		const validate = EmployeeFilter.safeParse(newFilter);
		if (!validate.success) {
			return {
				status: "error",
				message: validate.error.errors[0].message,
			};
		}
		// initiate  validated filter object
		const constructedFilter: EmployeeFilter = {
			data: validate.data.data,
			operation: validate.data.operation,
			property: validate.data.property,
		};

		// organize filter data according to operation or property values

		const basicString = `${constructedFilter.property}_${constructedFilter.operation}_`;
		const readableFilter = getReadableFilterValues(validate.data, employees);
		const createdFilterLabelString = `${basicString}${readableFilter.data}`;
		const createdFilterValueString = `${basicString}${dataToStringWithCustomSeparator(constructedFilter.data)}`;

		const matchExist =
			filters.length > 0 &&
			filters.find(f => f.label === createdFilterLabelString);
		if (matchExist) {
			return {
				status: "error",
				message: "Filter Duplicate",
			};
		}

		const updatedFilterList = [
			...filters,
			{
				label: createdFilterLabelString,
				value: createdFilterValueString,
			},
		];
		// console.log("🚀 ~ updatedFilterList:", updatedFilterList);
		const filteredEmployees = await getFilteredEmployees(
			updatedFilterList.map(f => f.value),
		);

		return {
			status: "success",
			createdFilterValueString,
			updatedFilterList: updatedFilterList,
			employees: filteredEmployees,
		};
	} catch (error) {
		// console.log("🚀 ~ error:", error);
		let message = error;
		if (error instanceof Error) {
			message = error.message;
		}
		return { status: "error", message: `${message}` };
	}
};

export const getFilteredEmployees = async (
	filterValues: string[],
): Promise<Employee[]> => {
	const employees = await GetAllEmployees();
	if (filterValues.length === 0) {
		return employees;
	}
	const filters = stringValuesToFilter(filterValues.toString());
	const result = getFilteredResult({
		employees,
		filters,
	});
	return result;
};

export const DeleteManyEmployees = async (
	codes: number[],
): Promise<number[]> => {
	const result = await deleteMany(codes);
	if (result.status === "error") throw new Error(result.message);
	revalidatePath("/employees");
	revalidatePath("/profile");
	revalidatePath("/search");
	return result.data;
};
