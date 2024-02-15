"use server";

import { Operation, constructOperation } from "@/components/filters/constants";
import { deleteMany } from "@/database/employees-dataBase";
import {
	checkFilterMatch,
	dataToStringWithCustomSeparator,
	getReadableFilterValues,
} from "@/lib/utils/filterUtils";
import { BasicValues } from "@/types";
import { Employee, EmployeeFilter } from "@/validation/employeeSchema";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { GetAllEmployees } from "../profile/_actions";

export const addNewFilter = async ({
	filters,
	newFilter,
}: {
	filters: { [key: string]: EmployeeFilter }[];
	newFilter: EmployeeFilter;
}): Promise<{ [key: string]: EmployeeFilter } | undefined> => {
	const employees = await GetAllEmployees();
	// validate input filter
	const validate = EmployeeFilter.safeParse(newFilter);
	if (!validate.success) {
		return undefined;
	}
	// initiate  validated filter object
	const constructedFilter: EmployeeFilter = {
		data: validate.data.data,
		operation: validate.data.operation,
		property: validate.data.property,
	};

	// organize filter data according to operation or property values

	const readableFilter = getReadableFilterValues(validate.data, employees);

	const noMatchExist =
		filters.length > 0 &&
		filters.find(f => checkFilterMatch(Object.values(f)[0], readableFilter));
	if (noMatchExist) {
		return undefined;
	}
	// set string fot searchParams and fot filter list
	// if data is object or date  => format for filter list as key and
	// not format fot searchParams string

	const basicString = `${constructedFilter.property}_${constructedFilter.operation}_`;

	return {
		[`${basicString}${dataToStringWithCustomSeparator(readableFilter.data)}`]:
			constructedFilter,
	};
};

export const deleteExistingFilter = async ({}) => {};

export const getFilteredEmployees = async (
	filters: { [key: string]: EmployeeFilter }[],
): Promise<Employee[]> => {
	const employees = await GetAllEmployees();
	if (filters.length === 0) {
		return employees;
	}
	const filterValues: EmployeeFilter[] = filters.map(f => Object.values(f)[0]);

	return employees.filter(x => {
		return filterValues.some(f => {
			const data = constructOperation(f);
			return Operation(x[f.property] as BasicValues, {
				valueB: data.valueB,
				valueC: data.valueC,
				operation: data.operation,
			});
		});
	});
};

export const DeleteManyEmployees = async (
	codes: number[],
): Promise<Employee[]> => {
	const inputSchema = z.coerce.number().array();
	const validated = inputSchema.safeParse(codes);
	if (!validated.success) {
		return [];
	}
	revalidatePath("/employees");
	return deleteMany(validated.data);
};
