"use server";

import {
	checkFilterMatch,
	dataToStringWithCustomSeparator,
	getReadableFilterValues,
} from "@/lib/utils/filterUtils";
import { EmployeeFilter } from "@/validation/employeeSchema";
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
