"use server";

import { getFilteredResult } from "@/components/filters/constants";
import { deleteMany } from "@/database/employees-dataBase";
import {
	dataToStringWithCustomSeparator,
	getReadableFilterValues,
	stringValuesToFilter,
} from "@/lib/utils/filterUtils";
import { FilterOption } from "@/types";
import { Employee, EmployeeFilter } from "@/validation/employeeSchema";
import { revalidatePath } from "next/cache";
import { z } from "zod";
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
): Promise<Employee[]> => {
	const inputSchema = z.coerce.number().array();
	const validated = inputSchema.safeParse(codes);
	if (!validated.success) {
		return [];
	}
	const deleted = await deleteMany(validated.data);
	if (deleted.length > 0) {
		revalidatePath("/profile");
		revalidatePath("/search");
		revalidatePath("/employees");
	}
	return deleted;
};
